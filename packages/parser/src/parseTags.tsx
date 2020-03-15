// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { NodeType, NodeBase, ListNode, ImageNode, ListItemNode, IFrameNode } from './nodes';

export interface TagResolverArgs {
  element: DomElement;
  path: string[];
  children: NodeBase[];
  isWithinTextContainer: boolean;
}

export interface TagHandler {
  names: Set<string>;
  nodeType: NodeType;
  resolver: (args: TagResolverArgs) => NodeBase | undefined;
  canParseChildren: boolean;
}

export const LINK_NAMES = new Set(['a']);

const getWidthAndHeight = (element: DomElement) => {
  const width =
    parseInt(element.attribs?.width ?? '0', 10) ||
    parseInt(element.attribs?.['data-width'] ?? '0', 10) ||
    undefined;
  const height =
    parseInt(element.attribs?.height ?? '0', 10) ||
    parseInt(element.attribs?.['data-height'] ?? '0', 10) ||
    undefined;

  return { width, height };
};

export const createDefaultTagHandlers = (): TagHandler[] => [
  {
    names: LINK_NAMES,
    nodeType: NodeType.Link,
    canParseChildren: true,
    resolver: ({ path, element, children, isWithinTextContainer }: TagResolverArgs) => {
      if (element.name !== 'a' || !element.attribs) return undefined;
      const source = decodeHTML(element.attribs?.href ?? '');
      if (!source) return undefined;
      return {
        type: NodeType.Link,
        path,
        source,
        children,
        isWithinTextContainer,
      };
    },
  },
  {
    names: new Set(['img']),
    nodeType: NodeType.Image,
    canParseChildren: false,
    resolver: ({ path, element }: TagResolverArgs) => {
      if (element.name !== 'img' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.Image,
        path,
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
    resolver: ({ path, children }: TagResolverArgs) => {
      return {
        path,
        children,
        type: NodeType.ListItem,
      } as ListItemNode;
    },
  },
  {
    names: new Set(['ol', 'ul']),
    nodeType: NodeType.List,
    canParseChildren: true,
    resolver: ({ path, children, element }: TagResolverArgs) => {
      return {
        path,
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
    resolver: ({ path, element }: TagResolverArgs) => {
      if (element.name !== 'iframe' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.IFrame,
        path,
        source,
        width,
        height,
      } as IFrameNode;
    },
  },
];
