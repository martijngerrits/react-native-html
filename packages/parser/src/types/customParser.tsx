import type { NodeWithoutKey } from './nodes';
import type { DomElement } from './elements';
import { BlockBase } from '../blocks/BlockBase';
import { NodeRelationshipManager } from '../nodes/NodeRelationshipManager';

export interface CustomParserArgs {
  element: DomElement;
  pathIds: string[];
  isWithinTextContainer: boolean;
  isWithinHeader?: number;
  isWithinBold: boolean;
  isWithinItalic: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
  domElementId?: string;
  hasClassName: (className: string) => boolean;
  block: BlockBase;
  nodeRelationshipManager: NodeRelationshipManager;
}

export interface CustomParserResult {
  node?: NodeWithoutKey;
  continueParsingChildren?: boolean;
  continueParsing?: boolean;
}

export type CustomParser = (args: CustomParserArgs) => CustomParserResult | undefined;
