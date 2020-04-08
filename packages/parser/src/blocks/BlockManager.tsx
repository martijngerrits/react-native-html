import { DomElement, isTagElement, isTextElement, isOnlyWhiteSpaces } from '../types/elements';
import { NodeRelationshipManager } from '../nodes/NodeRelationshipManager';
import { AnonymousBlock, isAnonymousBlock } from './AnonymousBlock';
import { DefinedBlock } from './DefinedBlock';
import { BlockBase } from './BlockBase';
import { BlockType } from './BlockType';
import { createInlineTagsSet } from '../types/tags';

export interface BlockManager {
  createNewBlock: (
    element: DomElement,
    nodeRelationshipManager: NodeRelationshipManager,
    providedType?: BlockType | undefined
  ) => BlockBase;
  getBlockTypeForElement: (element: DomElement) => BlockType;
  getBlockForNextElement: (
    element: DomElement,
    nodeRelationshipManager: NodeRelationshipManager
  ) => BlockBase;
  getCurrentBlock: () => BlockBase | null;
  setCurrentBlock: (block: BlockBase | null) => void;
}

export const createBlockManager = (treatImageAsBlockElement: boolean): BlockManager => {
  let currentBlock: BlockBase | null = null;
  const inlineTags = createInlineTagsSet(treatImageAsBlockElement);

  const createNewBlock = (
    element: DomElement,
    nodeRelationshipManager: NodeRelationshipManager,
    providedType?: BlockType
  ): BlockBase => {
    const blockType = providedType ?? getBlockTypeForElement(element);
    const nextBlock =
      blockType === BlockType.Anonymous
        ? new AnonymousBlock(nodeRelationshipManager)
        : new DefinedBlock();
    currentBlock = nextBlock;

    return nextBlock;
  };

  const getBlockTypeForElement = (element: DomElement): BlockType => {
    if (
      (isTagElement(element) && inlineTags.has(element.name)) ||
      (isTextElement(element) &&
        (currentBlock?.type === BlockType.Anonymous || !isOnlyWhiteSpaces(element.data)))
    ) {
      // already in anonymous block, then this element will append it
      if (currentBlock?.type === BlockType.Anonymous) {
        return BlockType.Anonymous;
      }
      // otherwise, check if together with next element an anonymous block can be formed
      let nextElement = element.next;
      while (nextElement && isTextElement(nextElement) && isOnlyWhiteSpaces(nextElement.data)) {
        nextElement = nextElement.next;
      }
      if (
        nextElement &&
        (isTextElement(nextElement) ||
          (isTagElement(nextElement) && inlineTags.has(nextElement.name)))
      )
        return BlockType.Anonymous;
    }

    return BlockType.DefinedBlock;
  };

  const getBlockForNextElement = (
    element: DomElement,
    nodeRelationshipManager: NodeRelationshipManager
  ): BlockBase => {
    let blockType: BlockType | undefined;
    if (currentBlock && isAnonymousBlock(currentBlock)) {
      blockType = getBlockTypeForElement(element);
      if (blockType === BlockType.Anonymous) {
        return currentBlock;
      }
      // closing current anonymous block -> do any post processing
      currentBlock.postProcess();
    }
    return createNewBlock(element, nodeRelationshipManager, blockType);
  };

  const getCurrentBlock = (): BlockBase | null => currentBlock;

  const setCurrentBlock = (block: BlockBase | null): void => {
    if (currentBlock && isAnonymousBlock(currentBlock)) {
      currentBlock.postProcess();
    }
    currentBlock = block;
  };

  return {
    createNewBlock,
    getBlockTypeForElement,
    getBlockForNextElement,
    getCurrentBlock,
    setCurrentBlock,
  };
};
