// eslint-disable-next-line import/no-extraneous-dependencies
import { ViewStyle, TextStyle } from 'react-native';

export interface NodeBase {
  type: string;
  path: string[]; // names of dom elements + 'text'
  style: ViewStyle | TextStyle;
  children?: NodeBase[];
}

export enum NodeType {
  Text = 'Text',
  Image = 'Image',
  IFrame = 'IFrame',
  Link = 'Link',
  List = 'List',
  ListItem = 'ListItem',
}

export interface TextNode extends NodeBase {
  type: NodeType.Text;
  content: string;
}
export const isTextNode = (node: NodeBase): node is TextNode => node.type === NodeType.Text;

export interface ImageNode extends NodeBase {
  source: string;
  width?: number;
  height?: number;
  hasTextSibling: boolean;
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
  hasTextSibling: boolean;
  hasOnlyTextChildren: boolean;
}
export const isLinkNode = (node: NodeBase): node is LinkNode => node.type === NodeType.Link;

export type Node = TextNode | ImageNode | IFrameNode | ListNode | ListItemNode | LinkNode;

// TODO: table? input? labels? buttons?
