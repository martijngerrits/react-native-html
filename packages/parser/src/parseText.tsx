import { decodeHTML } from 'entities';

import { TextNodeWithoutKey, NodeType, NodeBase, isTextContainerNode } from './types/nodes';
import { DomElement, isOnlyWhiteSpaces } from './types/elements';

interface ParseTextArgs {
  element: DomElement;
  parentNode?: NodeBase;
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
  isTextContainerFirstChild?: boolean;
}

export const parseText = ({
  element,
  parentNode,
  header,
  isBold,
  isItalic,
  hasStrikethrough,
  isUnderlined,
  isWithinTextContainer,
  isWithinLink,
  isWithinList,
  isTextContainerFirstChild,
}: ParseTextArgs): TextNodeWithoutKey | undefined => {
  if (element.type !== 'text' || !element.data) {
    return undefined;
  }

  /**
   * @note Texts containing only whitespace characters are only allowed if direct child
   * of TextContainer node except for the first and last texts. This is to accomodate html like:
   * <p>
   *  <strong>test</stong>
   *  <span>hallo</span>
   *  <a href="#test">abc</a>
   * </p>
   *
   * This html would parse in a web browser as a single line with spaces between tags:
   * test hallo abc
   */

  const canBeSpaceWithinTextContainer =
    typeof isTextContainerFirstChild !== 'undefined' &&
    !isTextContainerFirstChild &&
    parentNode &&
    isTextContainerNode(parentNode);

  if (!canBeSpaceWithinTextContainer && isOnlyWhiteSpaces(element.data)) {
    return undefined;
  }

  /**
   * @note It should replace any new lines by space
   * and remove any duplicate spaces (has no effect in HTML but does in RN)
   */
  let content = element.data.replace(/[\r\n]/g, ' ').replace(/\s\s+/g, ' ');
  if (!isWithinTextContainer || isTextContainerFirstChild) {
    // remove leading spaces
    content = content.replace(/^\s+/, '');
  }
  content = decodeHTML(content);

  return {
    type: NodeType.Text,
    content,
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
