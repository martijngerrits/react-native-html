// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';

import {
  NodeBase,
  NodeWithoutKey,
  InternalLinkNode,
  isInternalLinkNode,
  getNodeKey,
  getPathName,
  isListItemNode,
  getElementAttribute,
} from './nodes';
import { TagHandler, LINK_NAMES, LIST_NAMES } from './parseTags';
import { parseText } from './parseText';
import { parseTextContainer } from './parseTextContainer';
import { CustomParser } from './customParser';
import { DomIdMap } from './domIdToKey';

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

const BOLD_PATH_NAMES = new Set(['b', 'strong']);
const ITALIC_PATH_NAMES = new Set(['i', 'em']);
const UNDERLINE_PATH_NAMES = new Set(['ins', 'u']);
const STRIKETHROUGH_PATH_NAMES = new Set(['strike', 'del']);
const HEADER_PATH_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const TEXT_CONTAINER_PATH_NAMES = new Set([...TEXT_FORMATTING_TAGS, 'a', 'text', 'br', 'span']);

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
  domIdToKeys: DomIdMap;
  tagHandlers: TagHandler[];
  isTextContainerFirstChild?: boolean;
  isTextContainerLastChild?: boolean;
  parent?: DomElement;
  parentNode?: NodeBase;
  parentPathIds?: string[];
  customParser?: CustomParser;
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

export function parseElement({
  element,
  pathName,
  parent,
  parentNode,
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
  domIdToKeys,
  isTextContainerFirstChild,
  isTextContainerLastChild,
}: ParseElementArgs) {
  const domElementId = getElementAttribute(element, 'id');
  let pathIds = [...parentPathIds];
  if (domElementId) {
    pathIds.unshift(domElementId);
  }

  let nextNodes = nodes;
  let canParseChildren = true;
  let parsedNode: NodeWithoutKey | null = null;
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
          const classNames = getElementAttribute(element, 'class');
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
      parentNode,
      isTextContainerFirstChild,
      isTextContainerLastChild,
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

  let node: NodeBase | undefined;
  if (parsedNode) {
    node = addNode({
      keyPrefix,
      nodes,
      node: parsedNode,
      pathIds,
      domIdToKeys,
      nodeMap,
      parentNode,
    });
    // going a level deeper, update key prefix
    if (nextNodes !== nodes) {
      nextKeyPrefix = node.key;
    }
    pathIds = [];

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
    const nextParentNode = node || parentNode;

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
    let selectedParentNode = parentNode;
    childrenGroups.forEach(childrenGroup => {
      if (childrenGroup.isTextContainer) {
        const children: NodeBase[] = [];
        const nodeWithoutKey = parseTextContainer({ children });
        const textContainerNode = addNode({
          keyPrefix: nextKeyPrefix,
          nodes: nextNodes,
          node: nodeWithoutKey,
          pathIds,
          domIdToKeys,
          nodeMap,
          parentNode: nextParentNode,
        });
        pathIds = [];

        // going a level deeper, update key prefix
        selectedKeyPrefix = textContainerNode.key;
        selectedParentNode = textContainerNode;
        selectedNodes = children;
      } else {
        selectedKeyPrefix = nextKeyPrefix;
        selectedNodes = nextNodes;
        selectedParentNode = nextParentNode;
      }
      const lastIndex = childrenGroup.children.length - 1;
      childrenGroup.children.forEach((child, index) => {
        parseElement({
          element: child,
          pathName: getPathName(child),
          parent: nextParent,
          parentNode: selectedParentNode,
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
          isWithinLink:
            isWithinLink || (LINK_NAMES.has(pathName) && !!getElementAttribute(element, 'href')),
          isWithinList: isWithinList || LIST_NAMES.has(pathName),
          keyPrefix: selectedKeyPrefix,
          nodeMap,
          domIdToKeys,
          isTextContainerFirstChild: childrenGroup.isTextContainer ? index === 0 : undefined,
          isTextContainerLastChild: childrenGroup.isTextContainer ? index === lastIndex : undefined,
        });
      });
    });
  }
}

interface AddNodeArgs {
  keyPrefix: string;
  node: NodeWithoutKey;
  nodes: NodeBase[];
  nodeMap: Map<string, NodeBase>;
  pathIds: string[];
  domIdToKeys: DomIdMap;
  parentNode?: NodeBase;
}

const addNode = ({
  keyPrefix,
  node: nodeWithoutKey,
  nodes,
  nodeMap,
  pathIds,
  domIdToKeys,
  parentNode,
}: AddNodeArgs): NodeBase => {
  const key = getNodeKey({ keyPrefix, index: nodes.length });
  const node = { key, parentKey: parentNode?.key, ...nodeWithoutKey };
  if (parentNode && nodes.length === 0 && isListItemNode(parentNode)) {
    node.isFirstChildInListItem = true;
  }
  nodes.push(node);
  nodeMap.set(key, node);
  pathIds.forEach((domId, index) => {
    const steps = index + 1;
    const existingKey = domIdToKeys.get(domId);
    if (!existingKey || existingKey.steps > steps) {
      domIdToKeys.set(domId, { key, steps });
    }
  });
  return node;
};
