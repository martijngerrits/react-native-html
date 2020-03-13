// eslint-disable-next-line import/no-extraneous-dependencies
import { ViewStyle, TextStyle } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { NodeBase, NodeType, TextNode, LinkNode, isLinkNode } from './nodes';
import { TagHandler } from './parseTags';

const TEXT_PATH_NAME = 'text';

const getPathName = (element: DomElement): string => {
  const pathName = element.type === 'text' ? TEXT_PATH_NAME : element.name;
  return pathName?.toLowerCase() ?? 'unknown';
};

const parseText = (
  element: DomElement,
  path: string[],
  style: ViewStyle | TextStyle
): TextNode | undefined => {
  if (element.type !== 'text' || !element.data) return undefined;

  return {
    type: NodeType.Text,
    path,
    content: decodeHTML(element.data),
    style,
  };
};

export function parseElement(
  element: DomElement,
  parent: DomElement | null,
  parentPath: string[],
  hasTextSibling: boolean,
  nodes: NodeBase[],
  htmlStyles: Record<string, ViewStyle | TextStyle>,
  inheritedStyle: ViewStyle | TextStyle,
  tagHandlers: TagHandler[],
  customElementParser?: ElementParser,
  parentLinkNode?: LinkNode
) {
  const pathName = getPathName(element);
  const path = [...parentPath, pathName];

  let style: ViewStyle | TextStyle;
  if (htmlStyles[pathName]) {
    style = { ...inheritedStyle, ...htmlStyles[pathName] };
  } else {
    style = { ...inheritedStyle };
  }

  let nextNodes = nodes;
  let canParseChildren = true;
  let nextParentNode = parentLinkNode;

  const customNode =
    customElementParser &&
    customElementParser({ element, parent, path, hasTextSibling, htmlStyles, style });
  if (customNode) {
    nodes.push(customNode);
  } else if (element.type === 'text') {
    const textNode = parseText(element, path, style);
    if (textNode) {
      nodes.push(textNode);
    }
  } else if (element.type === 'tag') {
    tagHandlers.forEach(tagHandler => {
      if (element.name && tagHandler.names.has(element.name)) {
        canParseChildren = tagHandler.canParseChildren;
        const children: NodeBase[] = [];
        const node = tagHandler.resolver({
          element,
          hasTextSibling,
          path,
          style,
          children,
        });
        if (node) {
          nodes.push(node);
          if (typeof node.children !== 'undefined') {
            nextNodes = children;
          }
          if (parentLinkNode) {
            // eslint-disable-next-line no-param-reassign
            parentLinkNode.hasOnlyTextChildren = false;
          }
          if (isLinkNode(node)) {
            nextParentNode = node;
          }
        }
      }
    });
  }

  if (canParseChildren && element.children) {
    const nextParent = element;
    const isThereAnyTextElement = element.children.some(el => getPathName(el) === TEXT_PATH_NAME);
    element.children.forEach(child => {
      parseElement(
        child,
        nextParent,
        path,
        isThereAnyTextElement,
        nextNodes,
        htmlStyles,
        style,
        tagHandlers,
        customElementParser,
        nextParentNode
      );
    });
  }
}

export interface ElementParserArgs {
  element: DomElement;
  parent: DomElement | null;
  path: string[];
  hasTextSibling: boolean;
  htmlStyles: Record<string, ViewStyle | TextStyle>;
  style: ViewStyle | TextStyle;
}

export type ElementParser = (args: ElementParserArgs) => NodeBase | undefined;
