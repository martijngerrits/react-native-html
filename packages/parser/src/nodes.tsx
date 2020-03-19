export interface NodeBase {
  /**
   * @desc Hash is used to uniquely identify the node for map-based structures
   */
  hash: string;
  type: string;
  children?: NodeBase[];
  /**
   * @desc isLinked is true when linked as element with '#{id}'
   */
  isLinkedTo?: boolean;
}
export type NodeWithoutHash = Omit<NodeBase, 'hash'>;

export enum NodeType {
  Text = 'Text',
  TextContainer = 'TextContainer',
  Image = 'Image',
  IFrame = 'IFrame',
  Link = 'Link',
  InternalLink = 'InternalLink',
  List = 'List',
  ListItem = 'ListItem',
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
}
export type TextNodeWithoutHash = Omit<TextNode, 'hash'>;
export const isTextNode = (node: NodeBase): node is TextNode => node.type === NodeType.Text;

export interface TextContainerNode extends NodeBase {
  type: NodeType.TextContainer;
  children: NodeBase[];
}
export type TextContainerNodeWithoutHash = Omit<TextContainerNode, 'hash'>;
export const isTextContainerNode = (node: NodeBase): node is TextContainerNode =>
  node.type === NodeType.TextContainer;

export interface ImageNode extends NodeBase {
  source: string;
  width?: number;
  height?: number;
  type: NodeType.Image;
}
export type ImageNodeWithoutHash = Omit<ImageNode, 'hash'>;
export const isImageNode = (node: NodeBase): node is ImageNode => node.type === NodeType.Image;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFrameNode extends NodeBase {
  type: NodeType.IFrame;
  source: string;
  width?: number;
  height?: number;
}
export type IFrameNodeWithoutHash = Omit<IFrameNode, 'hash'>;
export const isIFrameNode = (node: NodeBase): node is IFrameNode => node.type === NodeType.IFrame;

export interface ListNode extends NodeBase {
  type: NodeType.List;
  children: ListItemNode[];
  isOrdered: boolean;
}
export type ListNodeWithoutHash = Omit<ListNode, 'hash'>;
export const isListNode = (node: NodeBase): node is ListNode => node.type === NodeType.List;

export interface ListItemNode extends NodeBase {
  type: NodeType.ListItem;
  children: NodeBase[];
}
export type ListItemNodeWithoutHash = Omit<ListItemNode, 'hash'>;
export const isListItemNode = (node: NodeBase): node is ListItemNode =>
  node.type === NodeType.ListItem;

export interface LinkNode extends NodeBase {
  type: NodeType.Link;
  children: NodeBase[];
  source: string;
  isWithinTextContainer: boolean;
}
export type LinkNodeWithoutHash = Omit<LinkNode, 'hash'>;
export const isLinkNode = (node: NodeBase): node is LinkNode => node.type === NodeType.Link;

export interface InternalLinkNode extends NodeBase {
  type: NodeType.InternalLink;
  children: NodeBase[];
  domId: string;
  linkHash: string;
  isWithinTextContainer: boolean;
}
export type InternalLinkNodeWithoutHash = Omit<LinkNode, 'hash'>;
export const isInternalLinkNode = (node: NodeBase): node is InternalLinkNode =>
  node.type === NodeType.InternalLink;

export type Node =
  | TextNode
  | TextContainerNode
  | ImageNode
  | IFrameNode
  | ListNode
  | ListItemNode
  | LinkNode
  | InternalLinkNode;

// TODO: table? input? labels? buttons?

export const getNodeKey = (keyPrefix: string, nodeType: string, index: number) =>
  `${keyPrefix}${keyPrefix.length > 0 ? '_' : ''}${index}_${nodeType}`;

interface GenerateNodeHashArgs {
  keyPrefix?: string;
  nodeType: string;
  index: number;
}

// @see: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export function generateNodeHash({ keyPrefix = '', nodeType, index }: GenerateNodeHashArgs) {
  const key = getNodeKey(keyPrefix, nodeType, index);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    const charCode = key.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + charCode;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }

  return hash.toString();
}
