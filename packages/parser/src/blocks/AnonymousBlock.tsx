/* eslint-disable unicorn/prefer-text-content */
import { BlockBase } from './BlockBase';
import { TextContainerNode, getNodeKey, NodeType, isTextNode } from '../types/nodes';
import { NodeRelationshipManager } from '../nodes/NodeRelationshipManager';
import { LayoutRenderingContext } from '../types/tags';
import { BlockType } from './BlockType';

export class AnonymousBlock extends BlockBase {
  innerText: string;

  textContainerNode: TextContainerNode;

  shouldAddTextContainer: boolean;

  constructor(childGroup: NodeRelationshipManager) {
    super(LayoutRenderingContext.InlineFormattingContext, BlockType.Anonymous);
    this.innerText = '';
    const keyPrefix = childGroup.getParentNode()?.key ?? '';

    this.textContainerNode = {
      type: NodeType.TextContainer,
      children: [],
      key: getNodeKey({ keyPrefix, index: childGroup.getNodes().length }),
    };
    this.shouldAddTextContainer = true;
  }

  getTextContainerIfItNeedsToBeAdded(): TextContainerNode | null {
    if (this.shouldAddTextContainer) {
      this.shouldAddTextContainer = false;
      return this.textContainerNode;
    }
    return null;
  }

  postProcess(): void {
    // remove any trailing spaces
    // remove empty last node if needed
    let lastChild = this.textContainerNode.children[this.textContainerNode.children.length - 1];
    while (lastChild.children && lastChild.children.length > 0) {
      lastChild = lastChild.children[lastChild.children.length - 1];
    }
    // should always be a text node?
    if (isTextNode(lastChild) && lastChild.content.endsWith(' ')) {
      lastChild.content = lastChild.content.slice(0, -1);
      if (lastChild.content.length === 0) {
        // remove
        this.textContainerNode.children.pop();
      }
    }
  }
}
export const isAnonymousBlock = (block: BlockBase): block is AnonymousBlock =>
  block.type === BlockType.Anonymous;

/* eslint-enable unicorn/prefer-text-content */
