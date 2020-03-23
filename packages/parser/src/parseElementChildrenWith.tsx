// eslint-disable-next-line prettier/prettier
import type { ParseElementArgs } from './parseElement';
import { NodeBase, addNode } from './types/nodes';
import {
  DomElement,
  getPathName,
  isElementNotATextOrNotAnEmptyText,
  isOnlyWhiteSpaces,
  isElementText,
  getElementAttribute,
  ParseElementArgsBase,
} from './types/elements';
import { parseTextContainer } from './parseTextContainer';
import {
  TEXT_CONTAINER_PATH_NAMES,
  BOLD_PATH_NAMES,
  ITALIC_PATH_NAMES,
  STRIKETHROUGH_PATH_NAMES,
  UNDERLINE_PATH_NAMES,
  LINK_NAMES,
  LIST_NAMES,
  getHeaderNumber,
} from './types/tags';

export interface ParseElementChildrenArgs extends ParseElementArgsBase {
  parent?: DomElement;
  parentPathName?: string;
  parentNode?: NodeBase;
  excludeTags: Set<string>;
  nodes: NodeBase[];
  keyPrefix?: string;
  pathIds?: string[];
}

interface ChildGroup {
  isTextContainer: boolean;
  children: DomElement[];
}

export const parseElementChildrenWith = (
  children: DomElement[] | undefined,
  parseElement: (parserArgs: ParseElementArgs) => void,
  {
    parent,
    parentNode,
    parentPathName,
    nodes,
    keyPrefix = '',
    pathIds = [],
    excludeTags,
    domIdToKeys,
    nodeMap,
    tagHandlers,
    customParser,
    internalLinkNodes,
    isWithinTextContainer,
    isWithinHeader,
    isWithinBold,
    isWithinItalic,
    isWithinUnderline,
    isWithinStrikethrough,
    isWithinLink,
    isWithinList,
  }: ParseElementChildrenArgs
) => {
  if (!children) return;
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
  children.forEach((child, index) => {
    const childPathName = getPathName(child);
    if (!excludeTags.has(childPathName)) {
      // can this element be a new text container group?
      if (
        !shouldCreateTextContainer &&
        TEXT_CONTAINER_PATH_NAMES.has(childPathName) &&
        isElementNotATextOrNotAnEmptyText(child, childPathName)
      ) {
        // yes, but check if there valid element as well
        // if there is an empty text element, check the next one
        let nextIndex = index + 1;
        let nextChild = children && children[nextIndex];
        while (nextChild && isElementText(nextChild) && isOnlyWhiteSpaces(nextChild.data)) {
          nextIndex += 1;
          nextChild = children && children[nextIndex];
        }
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

  let selectedNodes = nodes;
  let selectedKeyPrefix = keyPrefix;
  let selectedParentNode = parentNode;
  let selectedPathIds = pathIds;
  childrenGroups.forEach(childrenGroup => {
    if (childrenGroup.isTextContainer) {
      const nextChildren: NodeBase[] = [];
      const nodeWithoutKey = parseTextContainer({ children: nextChildren });
      const textContainerNode = addNode({
        keyPrefix,
        nodes,
        node: nodeWithoutKey,
        pathIds: selectedPathIds,
        domIdToKeys,
        nodeMap,
        parentNode,
      });
      // eslint-disable-next-line no-param-reassign
      selectedPathIds = [];

      // going a level deeper, update key prefix
      selectedKeyPrefix = textContainerNode.key;
      selectedParentNode = textContainerNode;
      selectedNodes = nextChildren;
    } else {
      selectedKeyPrefix = keyPrefix;
      selectedNodes = nodes;
      selectedParentNode = parentNode;
    }
    const lastIndex = childrenGroup.children.length - 1;
    childrenGroup.children.forEach((child, index) => {
      parseElement({
        element: child,
        pathName: getPathName(child),
        parent,
        parentNode: selectedParentNode,
        parentPathIds: pathIds,
        nodes: selectedNodes,
        tagHandlers,
        customParser,
        excludeTags,
        internalLinkNodes,
        keyPrefix: selectedKeyPrefix,
        nodeMap,
        domIdToKeys,
        isTextContainerFirstChild: childrenGroup.isTextContainer ? index === 0 : undefined,
        isTextContainerLastChild: childrenGroup.isTextContainer ? index === lastIndex : undefined,
        isWithinTextContainer: isWithinTextContainer || childrenGroup.isTextContainer,
        ...getParentBasedFlags(parentPathName, parent, {
          isWithinBold,
          isWithinHeader,
          isWithinItalic,
          isWithinLink,
          isWithinList,
          isWithinStrikethrough,
          isWithinUnderline,
        }),
      });
    });
  });
};

interface ParentBasedFlags {
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  isWithinLink?: boolean;
  isWithinList?: boolean;
}

const getParentBasedFlags = (
  parentPathName: string | undefined,
  parent: DomElement | undefined,
  flags: ParentBasedFlags
) => {
  if (parentPathName) {
    const {
      isWithinBold,
      isWithinHeader,
      isWithinItalic,
      isWithinLink,
      isWithinList,
      isWithinStrikethrough,
      isWithinUnderline,
    } = flags;
    return {
      isWithinHeader: isWithinHeader ?? getHeaderNumber(parentPathName),
      isWithinBold: isWithinBold || BOLD_PATH_NAMES.has(parentPathName),
      isWithinItalic: isWithinItalic || ITALIC_PATH_NAMES.has(parentPathName),
      isWithinStrikethrough: isWithinStrikethrough || STRIKETHROUGH_PATH_NAMES.has(parentPathName),
      isWithinUnderline: isWithinUnderline || UNDERLINE_PATH_NAMES.has(parentPathName),
      isWithinLink:
        isWithinLink ||
        (parent && LINK_NAMES.has(parentPathName) && !!getElementAttribute(parent, 'href')),
      isWithinList: isWithinList || LIST_NAMES.has(parentPathName),
    };
  }
  return flags;
};
