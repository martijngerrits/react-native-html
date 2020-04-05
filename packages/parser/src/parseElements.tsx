import { ParserPerTag } from './parseTags';
import { parseElement } from './parseElement';
import { NodeReferences } from './types/nodes';
import { CustomParser } from './types/customParser';
import { DomElement, hasElementClassName } from './types/elements';
import { BlockManager } from './blocks/BlockManager';
import { NodeRelationshipManager } from './nodes/NodeRelationshipManager';
import { isAnonymousBlock } from './blocks/AnonymousBlock';

interface ParseElementsArgs {
  elements: DomElement[];
  parserPerTag: ParserPerTag;
  customParser?: CustomParser;
  excludeTags: Set<string>;
  parseFromCssClass?: string;
  blockManager: BlockManager;
  nodeRelationshipManager: NodeRelationshipManager;
  nodeReferences: NodeReferences;
}

export function parseElements({
  elements,
  parserPerTag,
  customParser,
  excludeTags,
  nodeReferences,
  parseFromCssClass,
  blockManager,
  nodeRelationshipManager,
}: ParseElementsArgs) {
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
}

const getElementByCssClass = (elements: DomElement[], cssClass: string) => {
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

const visitElements = (element: DomElement, cssClass: string, result: { element?: DomElement }) => {
  if (hasElementClassName(element, cssClass)) {
    // eslint-disable-next-line no-param-reassign
    result.element = element;
  } else if (element.children) {
    element.children.forEach(child => visitElements(child, cssClass, result));
  }
};
