import { TextContainerNode, NodeBase, getNodeKey } from './nodes';

export interface TextContainerGroup {
  textContainerNode: TextContainerNode;
  firstChildKey: string;
}

interface SetTextContainerGroupOptions {
  allowedToEndTextContainer?: boolean;
}

const UNSET_INDEX = -1;

export class ChildGroup {
  private parentNode?: NodeBase;

  private nodes: NodeBase[];

  private keyPrefix: string;

  private textContainerGroups: TextContainerGroup[];

  private currentTextContainerGroupIndex = UNSET_INDEX;

  private allowedToEndTextContainer = true;

  constructor(keyPrefix: string, nodes: NodeBase[], parentNode?: NodeBase) {
    this.parentNode = parentNode;
    this.nodes = nodes;
    this.keyPrefix = keyPrefix;
    this.textContainerGroups = [];
  }

  setTextContainerGroup(
    group: TextContainerGroup,
    { allowedToEndTextContainer }: SetTextContainerGroupOptions = {}
  ) {
    this.currentTextContainerGroupIndex = this.textContainerGroups.length;
    this.textContainerGroups.push(group);
    if (typeof allowedToEndTextContainer !== 'undefined') {
      this.allowedToEndTextContainer = allowedToEndTextContainer;
    }
  }

  isWithinTextContainer() {
    return this.currentTextContainerGroupIndex !== UNSET_INDEX;
  }

  getTextContainerGroup(): TextContainerGroup | undefined {
    return this.currentTextContainerGroupIndex !== UNSET_INDEX
      ? this.textContainerGroups[this.currentTextContainerGroupIndex]
      : undefined;
  }

  markEndOfTextContainerGroup() {
    this.currentTextContainerGroupIndex = UNSET_INDEX;
  }

  getNodes() {
    const group = this.getTextContainerGroup();
    return group ? group.textContainerNode.children : this.nodes;
  }

  getNodesAtChildGroupLevel() {
    return this.nodes;
  }

  getKeyPrefix() {
    const group = this.getTextContainerGroup();
    return group ? group.textContainerNode.key : this.keyPrefix;
  }

  getKeyPrefixAtChildGroupLevel() {
    return this.keyPrefix;
  }

  getParentNode() {
    const group = this.getTextContainerGroup();
    return group ? group.textContainerNode : this.parentNode;
  }

  getParentNodeAtChildGroupLevel() {
    return this.parentNode;
  }

  isTextContainerFirstChild() {
    const group = this.getTextContainerGroup();
    if (!group) return false;

    const index = this.getNodes().length;
    const key = getNodeKey({ index, keyPrefix: group.textContainerNode.key });
    return key === group.firstChildKey;
  }

  canEndTextGroup() {
    if (!this.allowedToEndTextContainer) return false;

    const group = this.getTextContainerGroup();
    return !!group && group.textContainerNode.children.length > 0;
  }
}
