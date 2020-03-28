import { NodeType, TextContainerNode, getNodeKey, isTextNode } from './types/nodes';
import {
  DomElement,
  isElementNotATextOrNotAnEmptyText,
  isElementText,
  isOnlyWhiteSpaces,
  getPathName,
  isElementBreak,
} from './types/elements';
import { TEXT_CONTAINER_PATH_NAMES } from './types/tags';
import { ChildGroup, TextContainerGroup } from './types/childGroups';

const canBeAddedToTextContainer = (input: string | DomElement) =>
  typeof input === 'string'
    ? TEXT_CONTAINER_PATH_NAMES.has(input)
    : TEXT_CONTAINER_PATH_NAMES.has(getPathName(input));

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
interface ShouldCreateTextContainerArgs {
  element: DomElement;
  pathName: string;
  childGroup: ChildGroup;
}

export const shouldCreateTextContainer = ({
  element,
  pathName,
  childGroup,
}: ShouldCreateTextContainerArgs): boolean => {
  // can this element be a new text container group?
  if (
    !childGroup.getTextContainerGroup() &&
    canBeAddedToTextContainer(pathName) &&
    isElementNotATextOrNotAnEmptyText(element, pathName)
  ) {
    // yes, but check if there valid element as well
    // if there is an empty text element, check the next one
    let nextChild = element.next;
    const isFirstElementText = isElementText(element);
    while (
      nextChild &&
      !canThisElementBeConsideredForCreatingTextContainer(isFirstElementText, nextChild)
    ) {
      nextChild = nextChild.next;
    }
    // yes, next valid element found
    return (nextChild && canBeAddedToTextContainer(nextChild)) ?? false;
  }

  return false;
};

const canThisElementBeConsideredForCreatingTextContainer = (
  isFirstElementText: boolean,
  element: DomElement
) => {
  // ignore white spaces only texts and breaks (breaks will be added to previous text element as \n)
  if (isElementText(element) && isOnlyWhiteSpaces(element.data)) return false;
  if (isFirstElementText && isElementBreak(element)) return false;

  return true;
};

interface ShouldEndTextContainerArgs {
  pathName: string;
  childGroup: ChildGroup;
}

export const shouldEndTextContainer = ({ pathName, childGroup }: ShouldEndTextContainerArgs) => {
  // can we?
  if (childGroup.canEndTextGroup()) {
    // are we within textContainer?
    const group = childGroup.getTextContainerGroup();
    if (group) {
      return !canBeAddedToTextContainer(pathName);
    }
  }
  return false;
};

/**
 *
 * @important it assumed that the provided element is the first child of text container
 */
export const createTextContainerGroup = (childGroup: ChildGroup): TextContainerGroup => {
  const keyPrefix = childGroup.getParentNode()?.key ?? '';
  const textContainerNode: TextContainerNode = {
    type: NodeType.TextContainer,
    children: [],
    key: getNodeKey({ keyPrefix, index: childGroup.getNodes().length }),
  };

  const firstChildKey = getNodeKey({ index: 0, keyPrefix: textContainerNode.key });

  return {
    textContainerNode,
    firstChildKey,
  };
};

export const removeEmptyTrailingTextNodesFromContainer = (textContainerNode: TextContainerNode) => {
  for (let i = textContainerNode.children.length - 1; i > -1; i -= 1) {
    const child = textContainerNode.children[i];
    if (child && isTextNode(child) && isOnlyWhiteSpaces(child.content)) {
      textContainerNode.children.pop();
    } else {
      break;
    }
  }
};

export const closeTextContainerGroup = (childGroup: ChildGroup) => {
  const group = childGroup.getTextContainerGroup();
  if (group) {
    removeEmptyTrailingTextNodesFromContainer(group.textContainerNode);
    childGroup.markEndOfTextContainerGroup();
  }
};
