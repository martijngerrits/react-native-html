import { decodeHTML } from 'entities';

import {
  NodeType,
  ListNode,
  ImageNode,
  ListItemNode,
  IFrameNode,
  NodeBase,
  NodeWithoutKey,
  isTextNode,
  TextNode,
} from './types/nodes';
import { getElementAttribute, DomElement } from './types/elements';
import { LINK_NAMES, LIST_NAMES } from './types/tags';
import { ChildGroup } from './types/childGroups';

export interface TagHandler {
  names: Set<string>;
  resolver: (args: TagResolverArgs) => NodeWithoutKey | undefined;
  canParseChildren: boolean;
}

export interface TagResolverArgs {
  element: DomElement;
  children: NodeBase[];
  childGroup: ChildGroup;
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
}

const getWidthAndHeight = (element: DomElement) => {
  const width =
    parseInt(getElementAttribute(element, 'width') ?? '0', 10) ||
    parseInt(getElementAttribute(element, 'data-width') ?? '0', 10) ||
    undefined;
  const height =
    parseInt(getElementAttribute(element, 'height') ?? '0', 10) ||
    parseInt(getElementAttribute(element, 'data-height') ?? '0', 10) ||
    undefined;

  return { width, height };
};

export const createDefaultTagHandlers = (): TagHandler[] => [
  {
    names: LINK_NAMES,
    canParseChildren: true,
    resolver: ({ element, children, isWithinTextContainer }: TagResolverArgs) => {
      if (element.name !== 'a' || !element.attribs) return undefined;
      let source = getElementAttribute(element, 'href');
      if (!source || source.startsWith('#')) return undefined;

      source = decodeHTML(source);

      return {
        type: NodeType.Link,
        source,
        children,
        isWithinTextContainer,
      };
    },
  },
  {
    names: LINK_NAMES,
    canParseChildren: true,
    resolver: ({ element, children, isWithinTextContainer }: TagResolverArgs) => {
      if (element.name !== 'a' || !element.attribs) return undefined;
      const source = getElementAttribute(element, 'href');
      if (!source || !source.startsWith('#') || source.length < 2) return undefined;

      const domId = source.substr(1);
      return {
        type: NodeType.InternalLink,
        targetKey: '', // will be added later
        hasResolvedTarget: false,
        children,
        domId,
        isWithinTextContainer,
      };
    },
  },
  {
    names: new Set(['img']),
    canParseChildren: false,
    resolver: ({ element }: TagResolverArgs) => {
      if (element.name !== 'img' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.Image,
        source,
        width,
        height,
      } as ImageNode;
    },
  },
  {
    names: new Set(['li']),
    canParseChildren: true,
    resolver: ({ children }: TagResolverArgs) => {
      return {
        children,
        type: NodeType.ListItem,
      } as ListItemNode;
    },
  },
  {
    names: LIST_NAMES,
    canParseChildren: true,
    resolver: ({ children, element }: TagResolverArgs) => {
      return {
        children,
        isOrdered: element.name === 'ol',
        type: NodeType.List,
      } as ListNode;
    },
  },
  {
    names: new Set(['br']),
    canParseChildren: false,
    resolver: ({
      childGroup,
      header,
      isBold,
      isItalic,
      hasStrikethrough,
      isUnderlined,
      isWithinTextContainer,
      isWithinLink,
      isWithinList,
    }: TagResolverArgs) => {
      const nodes = childGroup.getNodes();
      const previousChild = nodes[nodes.length - 1];
      if (previousChild && isTextNode(previousChild)) {
        // simply add \n to prev child
        previousChild.content += '\n';
        return undefined;
      }
      return {
        type: NodeType.Text,
        content: '\n',
        header,
        isBold,
        isItalic,
        hasStrikethrough,
        isUnderlined,
        isWithinTextContainer,
        isWithinLink,
        isWithinList,
      } as TextNode;
    },
  },
  {
    names: new Set(['iframe']),
    canParseChildren: false,
    resolver: ({ element }: TagResolverArgs) => {
      if (element.name !== 'iframe' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.IFrame,
        source,
        width,
        height,
      } as IFrameNode;
    },
  },
];
