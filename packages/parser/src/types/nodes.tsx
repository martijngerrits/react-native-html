import type { DomIdMap } from './elements';
import type { NodeRelationshipManager } from '../nodes/NodeRelationshipManager';

export interface NodeBase {
  /**
   * @desc key is used to uniquely identify the node for map-based structures
   */
  key: string;
  type: string;
  children?: NodeBase[];
  /**
   * @desc isLinked is true when linked as element with '#{id}'
   */
  isLinkedTo?: boolean;
  /**
   * @desc isFirstNodeInListItem is true when first child node in ListItemNode
   */
  isFirstChildInListItem?: boolean;
  parentKey?: string;
  isWithinTextContainer?: boolean;
}
export type NodeWithoutKey = Omit<NodeBase, 'key'>;

export enum NodeType {
  Text = 'Text',
  TextContainer = 'TextContainer',
  Image = 'Image',
  IFrame = 'IFrame',
  Link = 'Link',
  InternalLink = 'InternalLink',
  List = 'List',
  ListItem = 'ListItem',
  Table = 'Table',
}

export interface TextNode extends NodeBase {
  type: NodeType.Text;
  content: string;
  header?: number; // h1-h2-h3-h4-h5-h6
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
  canBeTextContainerBase: boolean;
  isAfterHeader: boolean;
}
export type TextNodeWithoutKey = Omit<TextNode, 'key'>;
export const isTextNode = (node: NodeBase): node is TextNode => node.type === NodeType.Text;

export interface TextContainerNode extends NodeBase {
  type: NodeType.TextContainer;
  children: NodeBase[];
  isAfterHeader: boolean;
}
export type TextContainerNodeWithoutKey = Omit<TextContainerNode, 'key'>;
export const isTextContainerNode = (node: NodeBase): node is TextContainerNode =>
  node.type === NodeType.TextContainer;

export interface ImageNode extends NodeBase {
  source: string;
  width?: number;
  height?: number;
  type: NodeType.Image;
}
export type ImageNodeWithoutKey = Omit<ImageNode, 'key'>;
export const isImageNode = (node: NodeBase): node is ImageNode => node.type === NodeType.Image;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFrameNode extends NodeBase {
  type: NodeType.IFrame;
  source: string;
  width?: number;
  height?: number;
}
export type IFrameNodeWithoutKey = Omit<IFrameNode, 'key'>;
export const isIFrameNode = (node: NodeBase): node is IFrameNode => node.type === NodeType.IFrame;

export interface ListNode extends NodeBase {
  type: NodeType.List;
  children: ListItemNode[];
  isOrdered: boolean;
}
export type ListNodeWithoutKey = Omit<ListNode, 'key'>;
export const isListNode = (node: NodeBase): node is ListNode => node.type === NodeType.List;

export interface ListItemNode extends NodeBase {
  type: NodeType.ListItem;
  children: NodeBase[];
}
export type ListItemNodeWithoutKey = Omit<ListItemNode, 'key'>;
export const isListItemNode = (node: NodeBase): node is ListItemNode =>
  node.type === NodeType.ListItem;

export interface LinkNode extends NodeBase {
  type: NodeType.Link;
  children: NodeBase[];
  source: string;
  isWithinTextContainer: boolean;
}
export type LinkNodeWithoutKey = Omit<LinkNode, 'key'>;
export const isLinkNode = (node: NodeBase): node is LinkNode => node.type === NodeType.Link;

const linkTypes = new Set<string>([NodeType.Link, NodeType.InternalLink]);
export const isLinkLikeNode = (node: NodeBase): node is LinkNode | InternalLinkNode =>
  linkTypes.has(node.type);

export interface InternalLinkNode extends NodeBase {
  type: NodeType.InternalLink;
  children: NodeBase[];
  domId: string;
  targetKey: string;
  hasResolvedTarget: boolean;
  isWithinTextContainer: boolean;
}
export type InternalLinkNodeWithoutKey = Omit<LinkNode, 'key'>;
export const isInternalLinkNode = (node: NodeBase): node is InternalLinkNode =>
  node.type === NodeType.InternalLink;

export interface TableNode extends NodeBase {
  type: NodeType.Table;
  source: string;
}
export type TableNodeWithoutKey = Omit<TableNode, 'key'>;
export const isTableNode = (node: NodeBase): node is TableNode => node.type === NodeType.Table;

export type Node =
  | TextNode
  | TextContainerNode
  | ImageNode
  | IFrameNode
  | ListNode
  | ListItemNode
  | LinkNode
  | InternalLinkNode
  | TableNode;

// TODO: table? input? labels? buttons?

interface GetNodeKeyArgs {
  keyPrefix?: string;
  index: number;
}

export const getNodeKey = ({ index, keyPrefix = '' }: GetNodeKeyArgs): string =>
  `${keyPrefix}${keyPrefix.length > 0 ? '_' : ''}${index}`;

interface AddNodeArgs {
  node: NodeWithoutKey;
  pathIds: string[];
  nodeReferences: NodeReferences;
  nodeRelationshipManager: NodeRelationshipManager;
}

export const addNode = ({
  node: nodeWithoutKey,
  pathIds,
  nodeReferences,
  nodeRelationshipManager,
}: AddNodeArgs): NodeBase => {
  const nodes = nodeRelationshipManager.getNodes();
  const key = getNodeKey({
    keyPrefix: nodeRelationshipManager.getKeyPrefix(),
    index: nodes.length,
  });
  const parentNode = nodeRelationshipManager.getParentNode();

  const node = { key, parentKey: parentNode?.key, ...nodeWithoutKey };
  if (parentNode && nodes.length === 0 && isListItemNode(parentNode)) {
    node.isFirstChildInListItem = true;
  }
  nodes.push(node);
  nodeReferences.nodeMap.set(key, node);
  pathIds.forEach((domId, index) => {
    const steps = index + 1;
    const existingKey = nodeReferences.domIdToKeys.get(domId);
    if (!existingKey || existingKey.steps > steps) {
      nodeReferences.domIdToKeys.set(domId, { key, steps });
    }
  });
  return node;
};

export interface NodeReferences {
  internalLinkNodes: InternalLinkNode[];
  nodeMap: Map<string, NodeBase>;
  domIdToKeys: DomIdMap;
}
