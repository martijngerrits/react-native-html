import {
  NodeBase,
  NodeWithoutKey,
  isInternalLinkNode,
  addNode,
  NodeReferences,
} from './types/nodes';
import { parseText } from './parseText';
import {
  getElementAttribute,
  hasElementClassName,
  DomElement,
  isTextElement,
  isTagElement,
} from './types/elements';
import { CustomParser } from './types/customParser';
import { NodeRelationshipManager } from './nodes/NodeRelationshipManager';
import { isDefinedBlock } from './blocks/DefinedBlock';
import { isAnonymousBlock } from './blocks/AnonymousBlock';
import { BlockBase } from './blocks/BlockBase';
import { BlockManager } from './blocks/BlockManager';
import { ParserPerTag } from './parseTags';

export interface ParseElementArgs {
  element: DomElement;
  parentPathIds?: string[];
  customParser?: CustomParser;
  block: BlockBase;
  excludeTags: Set<string>;
  parserPerTag: ParserPerTag;
  nodeReferences: NodeReferences;
  blockManager: BlockManager;
  nodeRelationshipManager: NodeRelationshipManager;
}

export function parseElement({
  element,
  parentPathIds = [],
  parserPerTag,
  customParser,
  excludeTags,
  nodeReferences,
  blockManager,
  nodeRelationshipManager,
  block,
}: ParseElementArgs): void {
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

  // a sibling or child is a defined block -> mark end of text container
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
  if (customParseResult?.continueParsing === false) {
    return;
  }

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
      nodes: nodeRelationshipManager.getNodes(),
    });
    if (textNode) {
      parsedNode = textNode;
    }
  } else if (isTagElement(element)) {
    const tagParser = parserPerTag[element.name];
    if (tagParser) {
      canParseChildren = tagParser.canParseChildren;
      const children: NodeBase[] = [];
      const nodeWithoutKey = tagParser.resolver({
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

    element.children.forEach(child => {
      const nextBlock = blockManager.getBlockForNextElement(child, nodeRelationshipManager);
      if (!child.name || !excludeTags.has(child.name)) {
        parseElement({
          element: child,
          parentPathIds: pathIds,
          parserPerTag,
          customParser,
          excludeTags,
          nodeReferences,
          nodeRelationshipManager,
          blockManager,
          block: nextBlock,
        });
      }
    });

    nodeRelationshipManager.setParentFlags(parentFlags);

    // the parent is a defined block -> mark end of text container
    if (isDefinedBlock(block) && nodeRelationshipManager.isWithinTextContainer()) {
      nodeRelationshipManager.switchToTextContainerSiblings();
      blockManager.setCurrentBlock(block);
    }

    if (node && node.children) {
      const parentNode = node.parentKey && nodeReferences.nodeMap.get(node.parentKey);
      nodeRelationshipManager.setParentNode(parentNode || null);
      nodeRelationshipManager.goUp(nodes);
    }
  }
}
