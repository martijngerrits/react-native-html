import './types/modules';
import {
  DomHandler as OriginalDomHandler,
  Parser as OriginalParser,
} from 'htmlparser2-without-node-native';

import { NodeBase, NodeReferences } from './types/nodes';
import { resolveInternalLinks } from './resolveInternalLinks';
import { CustomParser } from './types/customParser';
import { parseElements } from './parseElements';
import { DomElementBase } from './types/elements';
import { createDefaultParserPerTag, ParserPerTag } from './parseTags';
import { createNodeRelationshipManager } from './nodes/NodeRelationshipManager';
import { createBlockManager } from './blocks/BlockManager';

export enum ResultType {
  Failure,
  Success,
}

export interface SuccessResult {
  type: ResultType.Success;
  nodes: NodeBase[];
}
export interface Failureresult {
  type: ResultType.Failure;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export type ParseHtmlResult = SuccessResult | Failureresult;

export interface ParseHtmlOptions {
  /**
   * Use the custom parser to convert any element in a custom node
   */
  customParser?: CustomParser;
  /**
   * Use the tag handlers to change how tags
   */
  parserPerTag?: ParserPerTag;
  excludeTags?: Set<string>;
  parseFromCssClass?: string;
  DomHandler?: typeof OriginalDomHandler;
  Parser?: typeof OriginalParser;

  /**
   * If true, it treats images as blocks
   */
}

export async function parseHtml<S, T extends DomElementBase<S> = DomElementBase<S>>(
  rawHtml: string,
  {
    customParser,
    parserPerTag = createDefaultParserPerTag(),
    parseFromCssClass,
    excludeTags = new Set([
      'input',
      'textarea',
      'dl',
      'table',
      'audio',
      'video',
      'form',
      'button',
      'frame',
      'frameset',
      'noframes',
      'script',
      'noscript',
      'object',
      'option',
      'track',
    ]),
    DomHandler = OriginalDomHandler,
    Parser = OriginalParser,
  }: ParseHtmlOptions = {}
): Promise<ParseHtmlResult> {
  try {
    const promise = new Promise<DomElementBase<T>[]>((resolve, reject) => {
      const handler = new DomHandler((err, dom) => {
        if (err) {
          reject(err);
        } else {
          resolve((dom as unknown) as DomElementBase<T>[]);
        }
      });
      const parser = new Parser(handler, { lowerCaseTags: true });
      parser.write(rawHtml);
      parser.done();
    });

    const elements = await promise;

    const nodes: NodeBase[] = [];
    const nodeReferences: NodeReferences = {
      internalLinkNodes: [],
      nodeMap: new Map(),
      domIdToKeys: new Map(),
    };
    const nodeRelationshipManager = createNodeRelationshipManager(nodes);
    const blockManager = createBlockManager();

    parseElements({
      elements,
      parserPerTag,
      customParser,
      excludeTags,
      nodeReferences,
      parseFromCssClass,
      nodeRelationshipManager,
      blockManager,
    });

    resolveInternalLinks({
      nodeReferences,
    });

    return {
      type: ResultType.Success,
      nodes,
    };
  } catch (error) {
    return {
      type: ResultType.Failure,
      error,
    };
  }
}
