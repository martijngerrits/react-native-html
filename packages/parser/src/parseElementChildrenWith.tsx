// eslint-disable-next-line prettier/prettier
import type { ParseElementArgs } from './parseElement';
import { NodeBase, isLinkLikeNode } from './types/nodes';
import {
  DomElement,
  getPathName,
  ParseElementArgsBase,
} from './types/elements';
import {
  BOLD_PATH_NAMES,
  ITALIC_PATH_NAMES,
  STRIKETHROUGH_PATH_NAMES,
  UNDERLINE_PATH_NAMES,
  LIST_NAMES,
  getHeaderNumber,
} from './types/tags';
import { ChildGroup } from './types/childGroups';
import { closeTextContainerGroup } from './parseTextContainer';

export interface ParseElementChildrenArgs extends ParseElementArgsBase {
  parentPathName?: string;
  parentNode?: NodeBase;
  excludeTags: Set<string>;
  nodes: NodeBase[];
  keyPrefix?: string;
  pathIds?: string[];
  parentChildGroup?: ChildGroup;
  shouldContinueAddingChildrenToTextContainer?: boolean;
}


export const parseElementChildrenWith = (
  children: DomElement[] | undefined,
  parseElement: (parserArgs: ParseElementArgs) => void,
  {
    parentNode,
    parentPathName,
    parentChildGroup,
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
    shouldContinueAddingChildrenToTextContainer
  }: ParseElementChildrenArgs
) => {
  if (!children) return;

  let childGroup: ChildGroup
  if (parentChildGroup && shouldContinueAddingChildrenToTextContainer) {
    childGroup = new ChildGroup(
      parentChildGroup.getKeyPrefixAtChildGroupLevel(),
      parentChildGroup.getNodesAtChildGroupLevel(),
      parentChildGroup.getParentNodeAtChildGroupLevel()
    );
    const textContainerGroup = parentChildGroup?.getTextContainerGroup();
    if (textContainerGroup) {
      childGroup.setTextContainerGroup(textContainerGroup);
    }
  } else {
    childGroup = new ChildGroup(keyPrefix, nodes, parentNode);
  }

  children.forEach(child => {
    const childPathName = getPathName(child);
    if (!excludeTags.has(childPathName)) {
      parseElement({
        element: child,
        parentPathIds: pathIds,
        pathName: childPathName,
        tagHandlers,
        customParser,
        excludeTags,
        internalLinkNodes,
        nodeMap,
        domIdToKeys,
        isWithinTextContainer,
        childGroup,
        ...getParentBasedFlags(parentPathName, childGroup.getParentNode(), {
          isWithinBold,
          isWithinHeader,
          isWithinItalic,
          isWithinLink,
          isWithinList,
          isWithinStrikethrough,
          isWithinUnderline,
        }),
      });
    }
  });

  if (!shouldContinueAddingChildrenToTextContainer && childGroup.isWithinTextContainer()) {
    closeTextContainerGroup(childGroup);
  }
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
  parentNode: NodeBase | undefined,
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
        isWithinLink || (!!parentNode && isLinkLikeNode(parentNode)),
      isWithinList: isWithinList || LIST_NAMES.has(parentPathName),
    };
  }
  return flags;
};
