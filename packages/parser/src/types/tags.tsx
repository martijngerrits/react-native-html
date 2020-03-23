// eslint-disable-next-line prettier/prettier
import type { DomElement } from './elements';
import type { NodeBase, NodeWithoutKey, NodeType } from './nodes';

export const TEXT_FORMATTING_TAGS = [
  'b',
  'strong',
  'i',
  'em',
  'mark',
  'small',
  'del',
  'ins',
  'sub',
  'sup',
  'strike',
  'u',
];

export const BOLD_PATH_NAMES = new Set(['b', 'strong']);
export const ITALIC_PATH_NAMES = new Set(['i', 'em']);
export const UNDERLINE_PATH_NAMES = new Set(['ins', 'u']);
export const STRIKETHROUGH_PATH_NAMES = new Set(['strike', 'del']);
export const HEADER_PATH_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
export const TEXT_CONTAINER_PATH_NAMES = new Set([
  ...TEXT_FORMATTING_TAGS,
  'a',
  'text',
  'br',
  'span',
]);

export const LINK_NAMES = new Set(['a']);
export const LIST_NAMES = new Set(['ol', 'ul']);

export const getHeaderNumber = (pathName: string): number | undefined => {
  if (HEADER_PATH_NAMES.has(pathName)) {
    try {
      return parseInt(pathName.substr(1), 10);
    } catch (err) {
      // do nothing
    }
  }
  return undefined;
};

export interface TagHandler {
  names: Set<string>;
  nodeType: NodeType;
  resolver: (args: TagResolverArgs) => NodeWithoutKey | undefined;
  canParseChildren: boolean;
}

export interface TagResolverArgs {
  element: DomElement;
  children: NodeBase[];
  isWithinTextContainer: boolean;
}
