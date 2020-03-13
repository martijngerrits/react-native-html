// eslint-disable-next-line import/no-extraneous-dependencies
import { ViewStyle, TextStyle } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { NodeType, NodeBase, ListNode, ImageNode, ListItemNode, IFrameNode } from './nodes';

export interface TagResolverArgs {
  element: DomElement;
  path: string[];
  hasTextSibling: boolean;
  style: ViewStyle | TextStyle;
  children: NodeBase[];
}

export interface TagHandler {
  names: Set<string>;
  nodeType: NodeType;
  resolver: (args: TagResolverArgs) => NodeBase | undefined;
  canParseChildren: boolean;
}

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
    names: new Set(['a']),
    nodeType: NodeType.Link,
    canParseChildren: true,
    resolver: ({ path, element, children, hasTextSibling, style }: TagResolverArgs) => {
      if (element.name !== 'a' || !element.attribs) return undefined;
      const source = decodeHTML(element.attribs?.href ?? '');
      if (!source) return undefined;
      return {
        type: NodeType.Link,
        path,
        source,
        children,
        hasTextSibling,
        hasOnlyTextChildren: true, // will be updated in parseElement based on children's node
        style,
      };
    },
  },
  {
    names: new Set(['img']),
    nodeType: NodeType.Image,
    canParseChildren: true,
    resolver: ({ path, element, style, hasTextSibling }: TagResolverArgs) => {
      if (element.name !== 'img' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.Image,
        path,
        hasTextSibling,
        source,
        width,
        height,
        style,
      } as ImageNode;
    },
  },
  {
    names: new Set(['li']),
    nodeType: NodeType.ListItem,
    canParseChildren: true,
    resolver: ({ path, children, style }: TagResolverArgs) => {
      return {
        path,
        style,
        children,
        type: NodeType.ListItem,
      } as ListItemNode;
    },
  },
  {
    names: new Set(['ol', 'ul']),
    nodeType: NodeType.List,
    canParseChildren: true,
    resolver: ({ path, children, style, element }: TagResolverArgs) => {
      return {
        path,
        children,
        style,
        isOrdered: element.name === 'ol',
        type: NodeType.List,
      } as ListNode;
    },
  },
  {
    names: new Set(['iframe']),
    nodeType: NodeType.IFrame,
    canParseChildren: false,
    resolver: ({ path, element, style }: TagResolverArgs) => {
      if (element.name !== 'iframe' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.IFrame,
        path,
        source,
        style,
        width,
        height,
      } as IFrameNode;
    },
  },
];
