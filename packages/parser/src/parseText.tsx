// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';
import { decodeHTML } from 'entities';

import { TextNodeWithoutKey, NodeType } from './nodes';

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

export const parseText = ({
  element,
  header,
  isBold,
  isItalic,
  hasStrikethrough,
  isUnderlined,
  isWithinTextContainer,
  isWithinLink,
  isWithinList,
}: ParseTextArgs): TextNodeWithoutKey | undefined => {
  if (element.type !== 'text' || !element.data || element.data.replace(/\s/g, '').length === 0) {
    return undefined;
  }

  /**
   * it should replace any new lines by space and remove any duplicate spaces (has no effect in HTML but does in RN)
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
