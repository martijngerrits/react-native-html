import { decodeHTML } from 'entities';

import { TextNodeWithoutKey, NodeType, NodeBase, isTextContainerNode } from './nodes';
import { DomElement } from './DomElement';

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
  isTextContainerLastChild?: boolean;
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
  isTextContainerLastChild,
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
    typeof isTextContainerLastChild !== 'undefined' &&
    !isTextContainerLastChild &&
    parentNode &&
    isTextContainerNode(parentNode);

  if (!canBeSpaceWithinTextContainer && element.data.replace(/\s/g, '').length === 0) {
    return undefined;
  }

  /**
   * @note It should replace any new lines by space and remove any duplicate spaces (has no effect in HTML but does in RN)
   */
  const content = decodeHTML(element.data.replace(/[\r\n]/g, ' ').replace(/\s\s+/g, ' '));

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
