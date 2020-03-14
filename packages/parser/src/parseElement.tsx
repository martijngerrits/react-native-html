// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { NodeBase, NodeType, TextNode, ParagraphNode } from './nodes';
import { TagHandler, createDefaultTagHandlers } from './parseTags';

const TEXT_FORMATTING_TAGS = [
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
const TEXT_PATH_NAME = 'text';
const TEXT_AND_TEXT_FORMATTINGS_PATH_NAMES = new Set([...TEXT_FORMATTING_TAGS, 'text']);
const BOLD_PATH_NAMES = new Set(['b', 'strong']);
const ITALIC_PATH_NAMES = new Set(['i', 'em']);
const UNDERLINE_PATH_NAMES = new Set(['ins', 'u']);
const STRIKETHROUGH_PATH_NAMES = new Set(['strike', 'del']);
const PARAGRAPH_PATH_NAMES = new Set(['p', 'span', 'div']);
const PARAGRAPH_CHILD_PATH_NAMES = new Set([...TEXT_FORMATTING_TAGS, 'text', 'a']);
const HEADER_PATH_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const getPathName = (element: DomElement): string => {
  const pathName = element.type === 'text' ? TEXT_PATH_NAME : element.name;
  return pathName?.toLowerCase() ?? 'unknown';
};

const getHeaderNumber = (pathName: string): number | undefined => {
  if (HEADER_PATH_NAMES.has(pathName)) {
    try {
      return parseInt(pathName.substr(1), 10);
    } catch (err) {
      // do nothing
    }
  }
  return undefined;
};

interface ParseTextArgs {
  element: DomElement;
  path: string[];
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
}

const parseText = ({
  element,
  path,
  header,
  isBold,
  isItalic,
  hasStrikethrough,
  isUnderlined,
}: ParseTextArgs): TextNode | undefined => {
  if (element.type !== 'text' || !element.data || !element.data.replace(/\s/g, '').length) {
    return undefined;
  }

  return {
    type: NodeType.Text,
    path,
    content: decodeHTML(element.data),
    header,
    isBold,
    isItalic,
    hasStrikethrough,
    isUnderlined,
  };
};

interface ParseParagraphArgs {
  path: string[];
  children: NodeBase[];
}

const parseParagraph = ({ path, children }: ParseParagraphArgs): ParagraphNode => {
  return {
    type: NodeType.Paragraph,
    path,
    children,
  };
};

interface ParseElementArgs {
  element: DomElement;
  pathName: string;
  parent?: DomElement;
  parentPath?: string[];
  hasTextSibling?: boolean;
  nodes: NodeBase[];
  tagHandlers: TagHandler[];
  customElementParser?: ElementParser;
  isWithinParagraph?: boolean;
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  excludeTags: Set<string>;
}

function parseElement({
  element,
  pathName,
  parent,
  parentPath = [],
  hasTextSibling = false,
  nodes,
  tagHandlers,
  customElementParser,
  isWithinParagraph = false,
  isWithinHeader,
  isWithinBold = false,
  isWithinItalic = false,
  isWithinStrikethrough = false,
  isWithinUnderline = false,
  excludeTags,
}: ParseElementArgs) {
  const path = [...parentPath, pathName];

  let nextNodes = nodes;
  let canParseChildren = true;

  const customNode =
    customElementParser &&
    customElementParser({
      element,
      parent,
      path,
      hasTextSibling,
      isWithinParagraph,
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
    });
  if (customNode) {
    nodes.push(customNode);
  } else if (element.type === 'text') {
    const textNode = parseText({
      element,
      path,
      header: isWithinHeader,
      isBold: isWithinBold,
      isItalic: isWithinItalic,
      isUnderlined: isWithinUnderline,
      hasStrikethrough: isWithinStrikethrough,
    });
    if (textNode) {
      nodes.push(textNode);
    }
  } else if (element.type === 'tag') {
    tagHandlers.forEach(tagHandler => {
      if (element.name && tagHandler.names.has(element.name)) {
        canParseChildren = tagHandler.canParseChildren;
        const children: NodeBase[] = [];
        const node = tagHandler.resolver({
          element,
          hasTextSibling,
          path,
          children,
          isWithinParagraph,
        });
        if (node) {
          nodes.push(node);
          if (node.children === children) {
            nextNodes = children;
          }
        }
      }
    });
  }

  if (canParseChildren && element.children) {
    const nextParent = element;
    let isThereAnyTextChild: boolean;
    let childrenCanBeParagraph = true;
    let anyTextLikeChild = false;
    const includedChildren: DomElement[] = [];

    element.children.forEach(child => {
      const childPathName = getPathName(child);
      if (!excludeTags.has(childPathName)) {
        includedChildren.push(child);
        if (childPathName === TEXT_PATH_NAME) {
          isThereAnyTextChild = true;
        }
        if (childrenCanBeParagraph && !PARAGRAPH_CHILD_PATH_NAMES.has(childPathName)) {
          childrenCanBeParagraph = false;
        }
        if (!anyTextLikeChild && TEXT_AND_TEXT_FORMATTINGS_PATH_NAMES.has(childPathName)) {
          anyTextLikeChild = true;
        }
      }
    });
    /**
     * purpose of paragraph node is to group together nodes inside a <Text /> so that they are inlined
     * @example <Text>this is an awesome <Text onPres=={..}>link</Text>! Check out this <Text>Bold</text> text.</Text>
     */
    if (
      !isWithinParagraph && // no paragraph when it is already contained in one
      PARAGRAPH_PATH_NAMES.has(pathName) && // only div, span, p
      includedChildren.length > 1 && // need to have more than one child
      anyTextLikeChild && // need to have at least one text like element
      childrenCanBeParagraph // all children are text like elments or links
    ) {
      nextNodes = [];
      const node = parseParagraph({ path, children: nextNodes });
      nodes.push(node);
    }

    includedChildren.forEach(child => {
      parseElement({
        element: child,
        pathName: getPathName(child),
        parent: nextParent,
        parentPath: path,
        hasTextSibling: isThereAnyTextChild,
        nodes: nextNodes,
        tagHandlers,
        customElementParser,
        excludeTags,
        isWithinParagraph: isWithinParagraph || childrenCanBeParagraph,
        isWithinHeader: isWithinHeader ?? getHeaderNumber(pathName),
        isWithinBold: isWithinBold || BOLD_PATH_NAMES.has(pathName),
        isWithinItalic: isWithinItalic || ITALIC_PATH_NAMES.has(pathName),
        isWithinStrikethrough: isWithinStrikethrough || STRIKETHROUGH_PATH_NAMES.has(pathName),
        isWithinUnderline: isWithinUnderline || UNDERLINE_PATH_NAMES.has(pathName),
      });
    });
  }
}

interface ParseElementsArgs {
  elements: DomElement[];
  nodes: NodeBase[];
  tagHandlers?: TagHandler[];
  customElementParser?: ElementParser;
  excludeTags: Set<string>;
}

export function parseElements({
  elements,
  nodes,
  tagHandlers = createDefaultTagHandlers(),
  customElementParser,
  excludeTags,
}: ParseElementsArgs) {
  elements.forEach(element => {
    const pathName = getPathName(element);
    if (!excludeTags.has(pathName)) {
      parseElement({
        element,
        pathName,
        nodes,
        tagHandlers,
        customElementParser,
        excludeTags,
      });
    }
  });
}

export interface ElementParserArgs {
  element: DomElement;
  parent?: DomElement;
  path: string[];
  hasTextSibling: boolean;
  isWithinParagraph: boolean;
  isWithinHeader?: number;
  isWithinBold: boolean;
  isWithinItalic: boolean;
}

export type ElementParser = (args: ElementParserArgs) => NodeBase | undefined;
