import { TextContainerNode, NodeBase, isLinkLikeNode } from '../types/nodes';
import { ParentBasedFlags, DomElement } from '../types/elements';
import {
  getHeaderNumber,
  BOLD_TAGS,
  ITALIC_TAGS,
  STRIKETHROUGH_TAGS,
  UNDERLINE_TAGS,
  LIST_TAGS,
} from '../types/tags';

/**
 * Manages the hierarchy among nodes
 * - should always be able to point to the list of current nodes to which new nodes must be added
 */

export const createNodeRelationshipManager = (nodes: NodeBase[]) => {
  let currentNodes = nodes;
  let parentNode: NodeBase | null = null;
  let parentNodeOfTextContainer: NodeBase | null = null;
  let textContainerSiblings: NodeBase[] | null = null;
  let textContainer: TextContainerNode | null = null;
  let parentFlags: ParentBasedFlags = {};

  const setTextContainer = (tc: TextContainerNode) => {
    textContainer = tc;
    textContainerSiblings = currentNodes;
    currentNodes = textContainer.children;
    parentNodeOfTextContainer = parentNode;
    parentNode = textContainer;
  };

  const switchToTextContainerSiblings = () => {
    textContainer = null;
    currentNodes = textContainerSiblings as NodeBase[];
    textContainerSiblings = null;
    parentNode = parentNodeOfTextContainer;
    parentNodeOfTextContainer = null;
  };

  const goDown = (children: NodeBase[]) => {
    currentNodes = children;
  };

  const goUp = (oneLevelHigherNodes: NodeBase[]) => {
    currentNodes = oneLevelHigherNodes;
  };

  const isWithinTextContainer = () => textContainer !== null;

  const getCurrentTextContainer = () => textContainer;

  const getNodes = () => currentNodes;

  const getKeyPrefix = () => {
    return parentNode?.key ?? '';
  };

  const getParentNode = () => parentNode;

  const setParentNode = (node: NodeBase | null) => {
    parentNode = node;
  };

  const updateParentFlags = (element: DomElement | undefined) => {
    if (element && element.name) {
      const {
        isWithinBold,
        isWithinHeader,
        isWithinItalic,
        isWithinLink,
        isWithinList,
        isWithinStrikethrough,
        isWithinUnderline,
      } = parentFlags;
      parentFlags = {
        isWithinHeader: isWithinHeader ?? getHeaderNumber(element.name),
        isWithinBold: isWithinBold || BOLD_TAGS.has(element.name),
        isWithinItalic: isWithinItalic || ITALIC_TAGS.has(element.name),
        isWithinStrikethrough: isWithinStrikethrough || STRIKETHROUGH_TAGS.has(element.name),
        isWithinUnderline: isWithinUnderline || UNDERLINE_TAGS.has(element.name),
        isWithinLink: isWithinLink || (!!parentNode && isLinkLikeNode(parentNode)),
        isWithinList: isWithinList || LIST_TAGS.has(element.name),
      };
    }
  };

  const getParentFlags = () => parentFlags;
  const setParentFlags = (flags: ParentBasedFlags) => {
    parentFlags = flags;
  };

  return {
    setTextContainer,
    switchToTextContainerSiblings,
    goDown,
    goUp,
    isWithinTextContainer,
    getCurrentTextContainer,
    getNodes,
    getKeyPrefix,
    getParentNode,
    setParentNode,
    updateParentFlags,
    getParentFlags,
    setParentFlags,
  };
};

export type NodeRelationshipManager = ReturnType<typeof createNodeRelationshipManager>;
