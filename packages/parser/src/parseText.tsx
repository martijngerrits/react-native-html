import { decodeHTML } from 'entities';

import { TextNodeWithoutKey, NodeType, isTextNode, TextNode } from './types/nodes';
import { isOnlyWhiteSpaces, TextElement } from './types/elements';
import { BlockBase } from './blocks/BlockBase';
import { isDefinedBlock } from './blocks/DefinedBlock';
import { isAnonymousBlock, AnonymousBlock } from './blocks/AnonymousBlock';

interface ParseTextArgs {
  element: TextElement;
  block: BlockBase;
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
}

const newLinesWithAdjacentSpaceRegex = /[ \t]*(\n)[ \t]*/g;
const tabsAndLineBreaksRegex = /[\t\n\r]/g;
const duplicateSpaceRegex = /\s\s+/g;

export const parseText = (parseTextArgs: ParseTextArgs): TextNodeWithoutKey | undefined => {
  const {
    element,
    block,
    header,
    isBold,
    isItalic,
    hasStrikethrough,
    isUnderlined,
    isWithinTextContainer,
    isWithinLink,
    isWithinList,
  } = parseTextArgs;
  /**
   * @note Texts containing only whitespace characters are only allowed if direct child
   * of TextContainer node except for the first and last texts. This is to accomodate html like:
   * <p>
   *  <strong>test</strong>
   *  <span>hallo</span>
   *  <a href="#test">abc</a>
   * </p>
   *
   * This html would parse in a web browser as a single line with spaces between tags:
   * test hallo abc
   *
   * However, we don't want whitespaces between br tags e.g.,:
   * <p>
   *   Random text
   *   <br />
   *   <br />
   * </p>
   * should be parsed into -> Random text\n\n and not Random text\n\n\n\n
   */

  /**
   * source: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
   */
  let content = element.data;

  /**
   * First, all spaces and tabs immediately before and after a line break are ignored:
   */
  content = content.replace(newLinesWithAdjacentSpaceRegex, '$1');

  /**
   * Next, all tab characters are handled as space characters and line breaks are converted to spaces
   */
  content = content.replace(tabsAndLineBreaksRegex, ' ');

  /**
   * After that, any space immediately following another space (even across two separate inline elements) is ignored
   */
  content = content.replace(duplicateSpaceRegex, ' ');

  if (isDefinedBlock(block)) {
    if (content.length === 0 || isOnlyWhiteSpaces(content)) {
      return undefined;
    }
    content = content.trim();
  } else if (isAnonymousBlock(block)) {
    const anonymousBlock = block as AnonymousBlock;
    /**
     * finally, sequences of spaces at the beginning and end of a line are removed.
     *
     * The final space will be removed in the post processing of anonymous block when the last node is known.
     */
    const isFirstText = anonymousBlock.innerText.length === 0;
    if (isFirstText && content.startsWith(' ')) {
      content = content.substring(1);
    }

    /**
     * Any space immediately following another space (even across two separate inline elements) is ignored.
     * Check if previous text ended with space. If so, remove the leading space here.
     */
    if (content.startsWith(' ') && anonymousBlock.innerText.endsWith(' ')) {
      content = content.substring(1);
    }

    if (content.length === 0) {
      return undefined;
    }

    anonymousBlock.innerText += content;

    // check if this text can be added to previous node if formatting is the same
    if (anonymousBlock.textContainerNode.children.length > 0) {
      const previousNode =
        anonymousBlock.textContainerNode.children[
          anonymousBlock.textContainerNode.children.length - 1
        ];
      if (
        isTextNode(previousNode) &&
        (isOnlyWhiteSpaces(content) || willBeSameTextNodes(previousNode, parseTextArgs))
      ) {
        previousNode.content += decodeHTML(content);
        return undefined;
      }
    }
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
    canBeTextContainerBase: !isBold && !isItalic && !hasStrikethrough && !isUnderlined,
  };
};

const willBeSameTextNodes = (prevNode: TextNode, flags: ParseTextArgs) => {
  return (
    prevNode.header === flags.header &&
    prevNode.isWithinLink === flags.isWithinLink &&
    prevNode.isWithinList === flags.isWithinList &&
    prevNode.isBold === flags.isBold &&
    prevNode.isItalic === flags.isItalic &&
    prevNode.hasStrikethrough === flags.hasStrikethrough &&
    prevNode.isUnderlined === flags.isUnderlined
  );
};
