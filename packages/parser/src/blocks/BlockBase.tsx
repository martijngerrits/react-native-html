import { LayoutRenderingContext } from '../types/tags';
import { DomElement } from '../types/elements';
import { BlockType } from './BlockType';

export abstract class BlockBase {
  layout: LayoutRenderingContext;

  type: BlockType;

  elements: DomElement[];

  constructor(layout: LayoutRenderingContext, type: BlockType) {
    this.layout = layout;
    this.type = type;
    this.elements = [];
  }
}
