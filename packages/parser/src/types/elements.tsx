// eslint-disable-next-line prettier/prettier
import type { NodeBase, InternalLinkNode } from './nodes';
import type { CustomParser } from './customParser';
import type { TagHandler } from '../parseTags';

export interface DomElementBase<T> {
  attribs?: { [s: string]: string };
  children?: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  name?: string;
  next?: T;
  parent?: T;
  prev?: T;
  type?: string;
}

export interface KeyInfo {
  key: string;
  steps: number;
}

export type DomIdMap = Map<string /* dom element id */, KeyInfo>;

export type DomElement = DomElementBase<DomElement>;

const TEXT_PATH_NAME = 'text';
const BR_PATH_NAME = 'br';

export const getPathName = (element: DomElement): string => {
  const pathName = element.type === 'text' ? TEXT_PATH_NAME : element.name;
  return pathName?.toLowerCase() ?? 'unknown';
};

const onlyWhiteSpacesRegex = /^\s+$/;
export const isOnlyWhiteSpaces = (input: string) => onlyWhiteSpacesRegex.test(input);

export const isElementText = (element: DomElement) => element.type === TEXT_PATH_NAME;
export const isElementBreak = (element: DomElement) => element.name === BR_PATH_NAME;

export const isElementNotATextOrNotAnEmptyText = (
  element: DomElement,
  pathName: string
): boolean => {
  return pathName !== TEXT_PATH_NAME || (element.data && !isOnlyWhiteSpaces(element.data));
};

export const getElementAttribute = (
  element: DomElement,
  attributeName: string
): string | undefined => {
  const attributes = element.attribs;
  if (attributes) {
    if (attributes[attributeName]) {
      return attributes[attributeName];
    }
    // check case insenstive
    const key = Object.keys(attributes).find(
      propertyName => attributeName === propertyName.toLowerCase()
    );
    if (key) {
      return attributes[key];
    }
  }
  return undefined;
};

export const hasElementClassName = (element: DomElement, className: string) => {
  if (element.type === 'tag') {
    const classNames = getElementAttribute(element, 'class');
    if (classNames) {
      const regex = new RegExp(`(?:^| )${className}(?:$| )`);
      return regex.test(classNames);
    }
  }
  return false;
};

export interface ParseElementArgsBase {
  excludeTags: Set<string>;
  domIdToKeys: DomIdMap;
  nodeMap: Map<string, NodeBase>;
  tagHandlers: TagHandler[];
  customParser?: CustomParser;
  internalLinkNodes: InternalLinkNode[];
  isWithinTextContainer?: boolean;
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  isWithinLink?: boolean;
  isWithinList?: boolean;
}

