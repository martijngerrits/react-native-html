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
import { TagHandler } from './parseTags';
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

export interface ParseHtmlArgs {
  rawHtml: string;
  customParser?: CustomParser;
  tagHandlers?: TagHandler[];
  excludeTags?: Set<string>;
  parseFromCssClass?: string;
  DomHandler?: typeof OriginalDomHandler;
  Parser?: typeof OriginalParser;
}

export async function parseHtml<S, T extends DomElementBase<S> = DomElementBase<S>>({
  rawHtml,
  customParser,
  tagHandlers,
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
}: ParseHtmlArgs): Promise<ParseHtmlResult> {
  try {
    const promise = new Promise<DomElementBase<T>[]>((resolve, reject) => {
      const handler = new DomHandler((err, dom) => {
        if (err) {
          reject(err);
        } else {
          resolve((dom as unknown) as DomElementBase<T>[]);
        }
      });
      const parser = new Parser(handler);
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
    const nodeRelationShipManager = createNodeRelationshipManager(nodes);
    const blockManager = createBlockManager();

    parseElements({
      elements,
      tagHandlers,
      customParser,
      excludeTags,
      nodeReferences,
      parseFromCssClass,
      nodeRelationshipManager: nodeRelationShipManager,
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
