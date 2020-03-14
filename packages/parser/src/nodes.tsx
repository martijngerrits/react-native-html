export interface NodeBase {
  type: string;
  path: string[]; // names of dom elements + 'text'
  children?: NodeBase[];
}

export enum NodeType {
  Text = 'Text',
  Paragraph = 'Paragraph',
  Image = 'Image',
  IFrame = 'IFrame',
  Link = 'Link',
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
}
export const isTextNode = (node: NodeBase): node is TextNode => node.type === NodeType.Text;

export interface ParagraphNode extends NodeBase {
  type: NodeType.Paragraph;
  children: NodeBase[];
}
export const isParagraphNode = (node: NodeBase): node is ParagraphNode =>
  node.type === NodeType.Paragraph;

export interface ImageNode extends NodeBase {
  source: string;
  width?: number;
  height?: number;
  isInline: boolean;
  type: NodeType.Image;
}
export const isImageNode = (node: NodeBase): node is ImageNode => node.type === NodeType.Image;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IFrameNode extends NodeBase {
  type: NodeType.IFrame;
  source: string;
  width?: number;
  height?: number;
}
export const isIFrameNode = (node: NodeBase): node is IFrameNode => node.type === NodeType.IFrame;

export interface ListNode extends NodeBase {
  type: NodeType.List;
  children: ListItemNode[];
  isOrdered: boolean;
}
export const isListNode = (node: NodeBase): node is ListNode => node.type === NodeType.List;

export interface ListItemNode extends NodeBase {
  type: NodeType.ListItem;
  children: NodeBase[];
}
export const isListItemNode = (node: NodeBase): node is ListItemNode =>
  node.type === NodeType.ListItem;

export interface LinkNode extends NodeBase {
  type: NodeType.Link;
  children: NodeBase[];
  source: string;
  isInline: boolean;
}
export const isLinkNode = (node: NodeBase): node is LinkNode => node.type === NodeType.Link;

export type Node = TextNode | ImageNode | IFrameNode | ListNode | ListItemNode | LinkNode;

// TODO: table? input? labels? buttons?
