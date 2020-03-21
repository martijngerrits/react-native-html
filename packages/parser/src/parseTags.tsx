import { decodeHTML } from 'entities';

import {
  NodeType,
  NodeBase,
  ListNode,
  ImageNode,
  ListItemNode,
  IFrameNode,
  NodeWithoutKey,
  getElementAttribute,
} from './nodes';
import { DomElement } from './DomElement';

export interface TagResolverArgs {
  element: DomElement;
  children: NodeBase[];
  isWithinTextContainer: boolean;
}

export interface TagHandler {
  names: Set<string>;
  nodeType: NodeType;
  resolver: (args: TagResolverArgs) => NodeWithoutKey | undefined;
  canParseChildren: boolean;
}

export const LINK_NAMES = new Set(['a']);
export const LIST_NAMES = new Set(['ol', 'ul']);

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
    nodeType: NodeType.Link,
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
    nodeType: NodeType.InternalLink,
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
    nodeType: NodeType.Image,
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
    nodeType: NodeType.ListItem,
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
    nodeType: NodeType.List,
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
    names: new Set(['iframe']),
    nodeType: NodeType.IFrame,
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
