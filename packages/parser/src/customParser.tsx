// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';

import { NodeWithoutKey } from './nodes';

export interface CustomParserArgs {
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

export interface CustomParserResult {
  node?: NodeWithoutKey;
  continueParsingChildren?: boolean;
}

export type CustomParser = (args: CustomParserArgs) => CustomParserResult | undefined;
