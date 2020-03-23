import { NodeBase, NodeWithoutKey, isInternalLinkNode, addNode } from './types/nodes';
import { parseText } from './parseText';
import {
  getElementAttribute,
  hasElementClassName,
  ParseElementArgsBase,
  DomElement,
} from './types/elements';
import { parseElementChildrenWith } from './parseElementChildrenWith';
import { CustomParser } from './types/customParser';

export interface ParseElementArgs extends ParseElementArgsBase {
  element: DomElement;
  pathName: string;
  nodes: NodeBase[];
  isTextContainerFirstChild?: boolean;
  isTextContainerLastChild?: boolean;
  parent?: DomElement;
  parentNode?: NodeBase;
  parentPathIds?: string[];
  customParser?: CustomParser;
  keyPrefix?: string;
}

export function parseElement({
  element,
  pathName,
  parent,
  parentNode,
  parentPathIds = [],
  nodes,
  tagHandlers,
  customParser,
  isWithinTextContainer = false,
  isWithinHeader,
  isWithinBold = false,
  isWithinItalic = false,
  isWithinStrikethrough = false,
  isWithinUnderline = false,
  isWithinLink = false,
  isWithinList = false,
  excludeTags,
  keyPrefix = '',
  nodeMap,
  internalLinkNodes,
  domIdToKeys,
  isTextContainerFirstChild,
  isTextContainerLastChild,
}: ParseElementArgs) {
  const domElementId = getElementAttribute(element, 'id');
  let pathIds = [...parentPathIds];
  if (domElementId) {
    pathIds.unshift(domElementId);
  }

  let nextNodes = nodes;
  let canParseChildren = true;
  let parsedNode: NodeWithoutKey | null = null;
  let nextKeyPrefix = keyPrefix;

  const customParseResult =
    customParser &&
    customParser({
      element,
      parent,
      pathIds,
      isWithinTextContainer,
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinLink,
      isWithinList,
      domElementId,
      hasClassName: (className: string) => hasElementClassName(element, className),
    });
  if (customParseResult?.node) {
    parsedNode = customParseResult.node;
  } else if (element.type === 'text') {
    const textNode = parseText({
      element,
      header: isWithinHeader,
      isBold: isWithinBold,
      isItalic: isWithinItalic,
      isUnderlined: isWithinUnderline,
      hasStrikethrough: isWithinStrikethrough,
      isWithinTextContainer,
      isWithinLink,
      isWithinList,
      parentNode,
      isTextContainerFirstChild,
      isTextContainerLastChild,
    });
    if (textNode) {
      parsedNode = textNode;
    }
  } else if (element.type === 'tag') {
    tagHandlers.forEach(tagHandler => {
      if (element.name && tagHandler.names.has(element.name)) {
        canParseChildren = tagHandler.canParseChildren;
        const children: NodeBase[] = [];
        const nodeWithoutKey = tagHandler.resolver({
          element,
          children,
          isWithinTextContainer,
        });
        if (nodeWithoutKey) {
          parsedNode = nodeWithoutKey;
          if (nodeWithoutKey.children === children) {
            nextNodes = children;
          }
        }
      }
    });
  }

  let node: NodeBase | undefined;
  if (parsedNode) {
    node = addNode({
      keyPrefix,
      nodes,
      node: parsedNode,
      pathIds,
      domIdToKeys,
      nodeMap,
      parentNode,
    });
    // going a level deeper, update key prefix
    if (nextNodes !== nodes) {
      nextKeyPrefix = node.key;
    }
    pathIds = [];

    if (isInternalLinkNode(node)) {
      internalLinkNodes.push(node);
    }
  }

  // allow the custom parser to control whether children should be parsed
  if (typeof customParseResult?.continueParsingChildren !== 'undefined') {
    canParseChildren = customParseResult.continueParsingChildren;
  }

  if (canParseChildren) {
    // Note: one special node can be added in parseElmentChildren -> TextContainerNode
    parseElementChildrenWith(element.children, parseElement, {
      parent: element,
      parentNode: node ?? parentNode,
      parentPathName: pathName,
      excludeTags,
      domIdToKeys,
      nodes: nextNodes,
      keyPrefix: nextKeyPrefix,
      pathIds,
      nodeMap,
      tagHandlers,
      internalLinkNodes,
      customParser,
      isWithinTextContainer,
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinUnderline,
      isWithinStrikethrough,
      isWithinLink,
      isWithinList,
    });
  }
}
