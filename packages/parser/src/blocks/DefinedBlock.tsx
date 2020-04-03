import { LayoutRenderingContext } from '../types/tags';
import { BlockType } from './BlockType';
import { BlockBase } from './BlockBase';

export class DefinedBlock extends BlockBase {
  constructor() {
    super(LayoutRenderingContext.BlockFormattingContext, BlockType.DefinedBlock);
  }
}
export const isDefinedBlock = (block: DefinedBlock): block is DefinedBlock =>
  block.type === BlockType.DefinedBlock;
