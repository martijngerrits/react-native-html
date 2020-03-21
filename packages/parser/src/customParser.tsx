import { NodeWithoutKey } from './nodes';
import { DomElement } from './DomElement';

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
  domElementId?: string;
  hasClassName: (className: string) => boolean;
}

export interface CustomParserResult {
  node?: NodeWithoutKey;
  continueParsingChildren?: boolean;
}

export type CustomParser = (args: CustomParserArgs) => CustomParserResult | undefined;
