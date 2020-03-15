// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { NodeBase, NodeType, TextNode, TextContainerNode } from './nodes';
import { TagHandler, createDefaultTagHandlers, LINK_NAMES } from './parseTags';

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
const BOLD_PATH_NAMES = new Set(['b', 'strong']);
const ITALIC_PATH_NAMES = new Set(['i', 'em']);
const UNDERLINE_PATH_NAMES = new Set(['ins', 'u']);
const STRIKETHROUGH_PATH_NAMES = new Set(['strike', 'del']);
const HEADER_PATH_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const TEXT_CONTAINER_PATH_NAMES = new Set([...TEXT_FORMATTING_TAGS, 'a', 'text']);

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
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
}

const parseText = ({
  element,
  path,
  header,
  isBold,
  isItalic,
  hasStrikethrough,
  isUnderlined,
  isWithinTextContainer,
  isWithinLink,
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
    isWithinTextContainer,
    isWithinLink,
  };
};

interface ParseParagraphArgs {
  path: string[];
  children: NodeBase[];
}

const parseTextContainer = ({ path, children }: ParseParagraphArgs): TextContainerNode => {
  return {
    type: NodeType.TextContainer,
    path,
    children,
  };
};

interface ChildGroup {
  isTextContainer: boolean;
  children: DomElement[];
}

interface ParseElementArgs {
  element: DomElement;
  pathName: string;
  parent?: DomElement;
  parentPath?: string[];
  nodes: NodeBase[];
  tagHandlers: TagHandler[];
  customElementParser?: ElementParser;
  isWithinTextContainer?: boolean;
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  isWithinLink?: boolean;
  excludeTags: Set<string>;
}

function parseElement({
  element,
  pathName,
  parent,
  parentPath = [],
  nodes,
  tagHandlers,
  customElementParser,
  isWithinTextContainer = false,
  isWithinHeader,
  isWithinBold = false,
  isWithinItalic = false,
  isWithinStrikethrough = false,
  isWithinUnderline = false,
  isWithinLink = false,
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
      isWithinTextContainer,
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
      isWithinTextContainer,
      isWithinLink,
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
          path,
          children,
          isWithinTextContainer,
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

    /**
     * purpose of text container node is to group together text like nodes inside a <Text /> so that they are inlined
     * @example <Text>this is an awesome <Text onPres=={..}>link</Text>! Check out this <Text>Bold</text> text.</Text>
     *
     * the children will be grouped together per text container or other nodes
     *
     * a text caontainer should be grouped together when:
     * - at least one <a />, <b />, etc. (i.e., TEXT_CONTAINER_TRIGGER_PATH_NAMES)
     * - at least one adjacent text element or <a />, <b />, etc. (i.e., TEXT_CONTAINER_TRIGGER_PATH_NAMES)
     * - add to the group together every adjacent text and tags like <a />, <b />, etc.
     */

    const childrenGroups: ChildGroup[] = [
      {
        isTextContainer: false,
        children: [],
      },
    ];
    let currentGroupIndex = 0;
    let shouldCreateTextContainer = false;
    element.children.forEach((child, index) => {
      const childPathName = getPathName(child);
      if (!excludeTags.has(childPathName)) {
        // can this element be a new text container group?
        if (!shouldCreateTextContainer && TEXT_CONTAINER_PATH_NAMES.has(childPathName)) {
          // yes, but check next element as well
          const nextChild = element.children && element.children[index + 1];
          if (nextChild && TEXT_CONTAINER_PATH_NAMES.has(getPathName(nextChild))) {
            // we should have a text container group

            // update flag if it is the first element
            if (currentGroupIndex === 0 && childrenGroups[0].children.length === 0) {
              childrenGroups[0].isTextContainer = true;

              // otherwise, add a new group
            } else {
              childrenGroups.push({
                isTextContainer: true,
                children: [],
              });
              currentGroupIndex += 1;
            }
            shouldCreateTextContainer = true;
          }

          // this is not a text container element but last group is a text container
        } else if (shouldCreateTextContainer && !TEXT_CONTAINER_PATH_NAMES.has(childPathName)) {
          childrenGroups.push({
            isTextContainer: false,
            children: [],
          });
          currentGroupIndex += 1;
          shouldCreateTextContainer = false;
        }

        childrenGroups[currentGroupIndex].children.push(child);
      }
    });

    let selectedNodes = nextNodes;
    childrenGroups.forEach(childrenGroup => {
      if (childrenGroup.isTextContainer) {
        const children: NodeBase[] = [];
        selectedNodes = children;
        const textContainerNode = parseTextContainer({ path, children });
        nodes.push(textContainerNode);
      } else {
        selectedNodes = nextNodes;
      }
      childrenGroup.children.forEach(child => {
        parseElement({
          element: child,
          pathName: getPathName(child),
          parent: nextParent,
          parentPath: path,
          nodes: selectedNodes,
          tagHandlers,
          customElementParser,
          excludeTags,
          isWithinTextContainer: isWithinTextContainer || childrenGroup.isTextContainer,
          isWithinHeader: isWithinHeader ?? getHeaderNumber(pathName),
          isWithinBold: isWithinBold || BOLD_PATH_NAMES.has(pathName),
          isWithinItalic: isWithinItalic || ITALIC_PATH_NAMES.has(pathName),
          isWithinStrikethrough: isWithinStrikethrough || STRIKETHROUGH_PATH_NAMES.has(pathName),
          isWithinUnderline: isWithinUnderline || UNDERLINE_PATH_NAMES.has(pathName),
          isWithinLink: isWithinLink || LINK_NAMES.has(pathName),
        });
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
  isWithinTextContainer: boolean;
  isWithinHeader?: number;
  isWithinBold: boolean;
  isWithinItalic: boolean;
}

export type ElementParser = (args: ElementParserArgs) => NodeBase | undefined;
