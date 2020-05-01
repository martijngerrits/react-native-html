import { ParserPerTag, createDefaultParserPerTag } from './parseTags';
import { parseElement } from './parseElement';
import { NodeReferences, NodeBase } from './types/nodes';
import { CustomParser } from './types/customParser';
import { DomElement, hasElementClassName } from './types/elements';
import { BlockManager, createBlockManager } from './blocks/BlockManager';
import {
  NodeRelationshipManager,
  createNodeRelationshipManager,
} from './nodes/NodeRelationshipManager';
import { isAnonymousBlock } from './blocks/AnonymousBlock';
import { resolveInternalLinks } from './resolveInternalLinks';
import { EXCLUDED_TAGS } from './types/tags';

interface ParseElementsArgs {
  elements: DomElement[];
  nodes?: NodeBase[];
  parserPerTag?: ParserPerTag;
  customParser?: CustomParser;
  customParserAdditionalArgs?: Record<string, unknown>;
  excludeTags?: Set<string>;
  parseFromCssClass?: string;
  blockManager?: BlockManager;
  nodeRelationshipManager?: NodeRelationshipManager;
  nodeReferences?: NodeReferences;
  treatImageAsBlockElement?: boolean;
}

export function parseElements({
  elements,
  parserPerTag = createDefaultParserPerTag(),
  customParser,
  customParserAdditionalArgs = {},
  excludeTags = EXCLUDED_TAGS,
  nodeReferences = {
    internalLinkNodes: [],
    nodeMap: new Map(),
    domIdToKeys: new Map(),
  },
  nodes = [],
  treatImageAsBlockElement = true,
  blockManager = createBlockManager(treatImageAsBlockElement),
  nodeRelationshipManager = createNodeRelationshipManager(nodes),
  parseFromCssClass,
}: ParseElementsArgs): NodeBase[] {
  let selectedElements: DomElement[];
  if (parseFromCssClass) {
    const element = getElementByCssClass(elements, parseFromCssClass);
    selectedElements = element ? [element] : [];
  } else {
    selectedElements = elements;
  }
  selectedElements.forEach(child => {
    const nextBlock = blockManager.getBlockForNextElement(child, nodeRelationshipManager);
    if (!child.name || !excludeTags.has(child.name)) {
      parseElement({
        element: child,
        parserPerTag,
        customParser,
        customParserAdditionalArgs,
        excludeTags,
        nodeReferences,
        nodeRelationshipManager,
        blockManager,
        block: nextBlock,
      });
    }
  });

  // if last block is anonymous, ensure it is closed for post processing
  const block = blockManager.getCurrentBlock();
  if (block && isAnonymousBlock(block)) {
    block.postProcess();
  }

  resolveInternalLinks({
    nodeReferences,
  });

  return nodes;
}

const getElementByCssClass = (elements: DomElement[], cssClass: string): DomElement | undefined => {
  // eslint-disable-next-line prefer-const
  const result: { element?: DomElement } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const element of elements) {
    visitElements(element, cssClass, result);
    if (result.element) {
      break;
    }
  }

  return result.element ? result.element : undefined;
};

const visitElements = (
  element: DomElement,
  cssClass: string,
  result: { element?: DomElement }
): void => {
  if (hasElementClassName(element, cssClass)) {
    // eslint-disable-next-line no-param-reassign
    result.element = element;
  } else if (element.children) {
    element.children.forEach(child => visitElements(child, cssClass, result));
  }
};
