// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import {
  NodeBase,
  NodeType,
  TextNodeWithoutHash,
  TextContainerNodeWithoutHash,
  NodeWithoutHash,
  InternalLinkNode,
  isInternalLinkNode,
  generateNodeHash,
  getNodeKey,
} from './nodes';
import { TagHandler, createDefaultTagHandlers, LINK_NAMES, LIST_NAMES } from './parseTags';

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
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
}

const parseText = ({
  element,
  header,
  isBold,
  isItalic,
  hasStrikethrough,
  isUnderlined,
  isWithinTextContainer,
  isWithinLink,
  isWithinList,
}: ParseTextArgs): TextNodeWithoutHash | undefined => {
  if (element.type !== 'text' || !element.data || !element.data.replace(/\s/g, '').length) {
    return undefined;
  }

  return {
    type: NodeType.Text,
    content: decodeHTML(element.data),
    header,
    isBold,
    isItalic,
    hasStrikethrough,
    isUnderlined,
    isWithinTextContainer,
    isWithinLink,
    isWithinList,
  };
};

interface ParseTextConatinerArgs {
  children: NodeBase[];
}

const parseTextContainer = ({ children }: ParseTextConatinerArgs): TextContainerNodeWithoutHash => {
  return {
    type: NodeType.TextContainer,
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
  nodes: NodeBase[];
  internalLinkNodes: InternalLinkNode[];
  nodeMap: Map<string, NodeBase>;
  hashToPathIds: Map<string, string[]>;
  tagHandlers: TagHandler[];
  parent?: DomElement;
  parentPathIds?: string[];
  customParser?: ElementParser;
  isWithinTextContainer?: boolean;
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  isWithinLink?: boolean;
  isWithinList?: boolean;
  excludeTags: Set<string>;
  keyPrefix?: string;
}

function parseElement({
  element,
  pathName,
  parent,
  parentPathIds = [],
  nodes,
  tagHandlers,
  customParser,
  isWithinTextContainer = false,
  isWithinHeader,
  isWithinBold = false,
  isWithinItalic = false,
  isWithinStrikethrough = false,
  isWithinUnderline = false,
  isWithinLink = false,
  isWithinList = false,
  excludeTags,
  keyPrefix = '',
  nodeMap,
  internalLinkNodes,
  hashToPathIds,
}: ParseElementArgs) {
  const domElementId = element?.attribs?.id ?? '';
  const pathIds = [...parentPathIds, domElementId];

  let nextNodes = nodes;
  let canParseChildren = true;
  let parsedNode: NodeWithoutHash | null = null;
  let nextKeyPrefix = keyPrefix;

  const customParseResult =
    customParser &&
    customParser({
      element,
      parent,
      pathIds,
      isWithinTextContainer,
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinLink,
      isWithinList,
      hasClassName: (className: string) => {
        if (element.type === 'tag') {
          const classNames = element.attribs?.class;
          if (classNames) {
            const regex = new RegExp(`(?:^| )${className}(?:$| )`);
            return regex.test(classNames);
          }
        }
        return false;
      },
    });
  if (customParseResult?.node) {
    parsedNode = customParseResult.node;
  } else if (element.type === 'text') {
    const textNode = parseText({
      element,
      header: isWithinHeader,
      isBold: isWithinBold,
      isItalic: isWithinItalic,
      isUnderlined: isWithinUnderline,
      hasStrikethrough: isWithinStrikethrough,
      isWithinTextContainer,
      isWithinLink,
      isWithinList,
    });
    if (textNode) {
      parsedNode = textNode;
    }
  } else if (element.type === 'tag') {
    tagHandlers.forEach(tagHandler => {
      if (element.name && tagHandler.names.has(element.name)) {
        canParseChildren = tagHandler.canParseChildren;
        const children: NodeBase[] = [];
        const nodeWithoutKey = tagHandler.resolver({
          element,
          children,
          isWithinTextContainer,
        });
        if (nodeWithoutKey) {
          parsedNode = nodeWithoutKey;
          if (nodeWithoutKey.children === children) {
            nextNodes = children;
          }
        }
      }
    });
  }

  if (parsedNode) {
    const hash = generateNodeHash({
      keyPrefix,
      nodeType: parsedNode.type,
      index: nodes.length,
    });
    const node = { hash, ...parsedNode };
    // going a level deeper, update key prefix
    if (nextNodes !== nodes) {
      nextKeyPrefix = getNodeKey(keyPrefix, parsedNode.type, nodes.length);
    }

    nodes.push(node);
    nodeMap.set(hash, node);
    hashToPathIds.set(hash, pathIds);
    if (isInternalLinkNode(node)) {
      internalLinkNodes.push(node);
    }
  }

  // allow the custom parser to control whether children should be parsed
  if (typeof customParseResult?.continueParsingChildren !== 'undefined') {
    canParseChildren = customParseResult.continueParsingChildren;
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
    let selectedKeyPrefix = nextKeyPrefix;
    childrenGroups.forEach(childrenGroup => {
      if (childrenGroup.isTextContainer) {
        const children: NodeBase[] = [];
        selectedNodes = children;
        const textContainerNode = parseTextContainer({ children });
        const hash = generateNodeHash({
          keyPrefix,
          nodeType: textContainerNode.type,
          index: nodes.length,
        });
        const node = { hash, ...textContainerNode };
        // going a level deeper, update key prefix
        selectedKeyPrefix = getNodeKey(keyPrefix, textContainerNode.type, nodes.length);
        nodes.push(node);
        nodeMap.set(hash, node);
        hashToPathIds.set(hash, pathIds);
      } else {
        selectedNodes = nextNodes;
      }
      childrenGroup.children.forEach(child => {
        parseElement({
          element: child,
          pathName: getPathName(child),
          parent: nextParent,
          parentPathIds: pathIds,
          nodes: selectedNodes,
          tagHandlers,
          customParser,
          excludeTags,
          internalLinkNodes,
          isWithinTextContainer: isWithinTextContainer || childrenGroup.isTextContainer,
          isWithinHeader: isWithinHeader ?? getHeaderNumber(pathName),
          isWithinBold: isWithinBold || BOLD_PATH_NAMES.has(pathName),
          isWithinItalic: isWithinItalic || ITALIC_PATH_NAMES.has(pathName),
          isWithinStrikethrough: isWithinStrikethrough || STRIKETHROUGH_PATH_NAMES.has(pathName),
          isWithinUnderline: isWithinUnderline || UNDERLINE_PATH_NAMES.has(pathName),
          isWithinLink: isWithinLink || LINK_NAMES.has(pathName),
          isWithinList: isWithinList || LIST_NAMES.has(pathName),
          keyPrefix: selectedKeyPrefix,
          nodeMap,
          hashToPathIds,
        });
      });
    });
  }
}

interface ParseElementsArgs {
  elements: DomElement[];
  nodes: NodeBase[];
  internalLinkNodes: InternalLinkNode[];
  tagHandlers?: TagHandler[];
  customParser?: ElementParser;
  excludeTags: Set<string>;
  hashToPathIds: Map<string, string[]>;
  nodeMap: Map<string, NodeBase>;
}

export function parseElements({
  elements,
  nodes,
  tagHandlers = createDefaultTagHandlers(),
  customParser,
  excludeTags,
  internalLinkNodes,
  hashToPathIds,
  nodeMap,
}: ParseElementsArgs) {
  elements.forEach(element => {
    const pathName = getPathName(element);
    if (!excludeTags.has(pathName)) {
      parseElement({
        element,
        pathName,
        internalLinkNodes,
        nodes,
        tagHandlers,
        customParser,
        excludeTags,
        hashToPathIds,
        nodeMap,
      });
    }
  });
}

export interface ElementParserArgs {
  element: DomElement;
  parent?: DomElement;
  pathIds: string[];
  isWithinTextContainer: boolean;
  isWithinHeader?: number;
  isWithinBold: boolean;
  isWithinItalic: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
  hasClassName: (className: string) => boolean;
}

export interface ElementParserResult {
  node?: NodeWithoutHash;
  continueParsingChildren?: boolean;
}

export type ElementParser = (args: ElementParserArgs) => ElementParserResult | undefined;
