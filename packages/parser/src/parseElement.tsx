import { NodeBase, NodeWithoutKey, isInternalLinkNode, addNode } from './types/nodes';
import { parseText } from './parseText';
import {
  getElementAttribute,
  hasElementClassName,
  ParseElementArgsBase,
  DomElement,
  isTextElement,
} from './types/elements';
import { parseElementChildrenWith } from './parseElementChildrenWith';
import { CustomParser } from './types/customParser';
import { NodeRelationshipManager } from './nodes/NodeRelationshipManager';
import { isDefinedBlock } from './blocks/DefinedBlock';
import { isAnonymousBlock } from './blocks/AnonymousBlock';
import { BlockBase } from './blocks/BlockBase';

export interface ParseElementArgs extends ParseElementArgsBase {
  element: DomElement;
  parentPathIds?: string[];
  customParser?: CustomParser;
  nodeRelationshipManager: NodeRelationshipManager;
  block: BlockBase;
}

export function parseElement({
  element,
  parentPathIds = [],
  tagHandlers,
  customParser,
  excludeTags,
  nodeReferences,
  blockManager,
  nodeRelationshipManager,
  block,
}: ParseElementArgs) {
  const {
    isWithinHeader,
    isWithinBold = false,
    isWithinItalic = false,
    isWithinStrikethrough = false,
    isWithinUnderline = false,
    isWithinLink = false,
    isWithinList = false,
  } = nodeRelationshipManager.getParentFlags();
  const domElementId = getElementAttribute(element, 'id');
  let pathIds = [...parentPathIds];
  if (domElementId) {
    pathIds.unshift(domElementId);
  }

  let canParseChildren = true;
  let parsedNode: NodeWithoutKey | null = null;

  if (isDefinedBlock(block) && nodeRelationshipManager.isWithinTextContainer()) {
    nodeRelationshipManager.switchToTextContainerSiblings();
  }
  if (isAnonymousBlock(block)) {
    const textContainer = block.getTextContainerIfItNeedsToBeAdded();
    if (textContainer) {
      addNode({
        node: textContainer,
        pathIds,
        nodeReferences,
        nodeRelationshipManager,
      });
      nodeRelationshipManager.setTextContainer(textContainer);
      pathIds = [];
    }
  }

  const customParseResult =
    customParser &&
    customParser({
      element,
      pathIds,
      isWithinTextContainer: nodeRelationshipManager.isWithinTextContainer(),
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinLink,
      isWithinList,
      domElementId,
      hasClassName: (className: string) => hasElementClassName(element, className),
      block,
      nodeRelationshipManager,
    });
  if (customParseResult?.node) {
    parsedNode = customParseResult.node;
  } else if (isTextElement(element)) {
    const textNode = parseText({
      element,
      header: isWithinHeader,
      isBold: isWithinBold,
      isItalic: isWithinItalic,
      isUnderlined: isWithinUnderline,
      hasStrikethrough: isWithinStrikethrough,
      isWithinTextContainer: nodeRelationshipManager.isWithinTextContainer(),
      isWithinLink,
      isWithinList,
      block,
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
          nodeRelationshipManager,
          isWithinTextContainer: nodeRelationshipManager.isWithinTextContainer(),
          header: isWithinHeader,
          isBold: isWithinBold,
          isItalic: isWithinItalic,
          hasStrikethrough: isWithinStrikethrough,
          isUnderlined: isWithinUnderline,
          isWithinLink,
          isWithinList,
        });
        if (nodeWithoutKey) {
          parsedNode = nodeWithoutKey;
        }
      }
    });
  }

  let node: NodeBase | undefined;
  if (parsedNode) {
    node = addNode({
      node: parsedNode,
      pathIds,
      nodeReferences,
      nodeRelationshipManager,
    });

    pathIds = [];

    if (isInternalLinkNode(node)) {
      nodeReferences.internalLinkNodes.push(node);
    }
  }

  // allow the custom parser to control whether children should be parsed
  if (typeof customParseResult?.continueParsingChildren !== 'undefined') {
    canParseChildren = customParseResult.continueParsingChildren;
  }

  if (canParseChildren && element.children) {
    const parentFlags = { ...nodeRelationshipManager.getParentFlags() };
    const nodes = nodeRelationshipManager.getNodes();
    if (node && node.children) {
      nodeRelationshipManager.setParentNode(node);
      nodeRelationshipManager.goDown(node.children);
    }
    nodeRelationshipManager.updateParentFlags(element);
    // Note: one special node can be added in parseElmentChildren -> TextContainerNode
    parseElementChildrenWith(element.children, parseElement, {
      excludeTags,
      nodeRelationshipManager,
      blockManager,
      pathIds,
      tagHandlers,
      nodeReferences,
      customParser,
    });
    nodeRelationshipManager.setParentFlags(parentFlags);

    if (node && node.children) {
      const parentNode = node.parentKey && nodeReferences.nodeMap.get(node.parentKey);
      nodeRelationshipManager.setParentNode(parentNode || null);
      nodeRelationshipManager.goUp(nodes);
    }
  }
}
