import { decodeHTML } from 'entities';

import {
  NodeType,
  ListNode,
  ImageNode,
  ListItemNode,
  IFrameNode,
  NodeBase,
  NodeWithoutKey,
  TextNode,
  isTextNode,
} from './types/nodes';
import { getElementAttribute, DomElement } from './types/elements';
import { LINK_TAGS, LIST_TAGS } from './types/tags';
import { NodeRelationshipManager } from './nodes/NodeRelationshipManager';

export interface TagHandler {
  names: Set<string>;
  resolver: (args: TagResolverArgs) => NodeWithoutKey | undefined;
  canParseChildren: boolean;
}

export interface TagResolverArgs {
  element: DomElement;
  children: NodeBase[];
  nodeRelationshipManager: NodeRelationshipManager;
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
    names: LINK_TAGS,
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
    names: LINK_TAGS,
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
    names: LIST_TAGS,
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
      header,
      isBold,
      isItalic,
      hasStrikethrough,
      isUnderlined,
      isWithinTextContainer,
      isWithinLink,
      isWithinList,
      nodeRelationshipManager,
    }: TagResolverArgs) => {
      // try to add to previous text node if any
      const nodes = nodeRelationshipManager.getNodes();
      if (nodes.length > 0) {
        const prevNode = nodes[nodes.length - 1];
        if (isTextNode(prevNode)) {
          prevNode.content += '\n';
          return undefined;
        }
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
        canBeTextContainerBase: true,
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
