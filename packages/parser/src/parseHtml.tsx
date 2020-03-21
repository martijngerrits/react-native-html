import {
  DomHandler as OriginalDomHandler,
  Parser as OriginalParser,
} from 'htmlparser2-without-node-native';

import { NodeBase, InternalLinkNode } from './nodes';
import { TagHandler } from './parseTags';
import { resolveInternalLinks } from './resolveInternalLinks';
import { CustomParser } from './customParser';
import { parseElements } from './parseElements';
import { DomIdMap } from './domIdToKey';
import { DomElementBase } from './DomElement';

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
    const internalLinkNodes: InternalLinkNode[] = [];
    const nodeMap = new Map<string, NodeBase>();
    const domIdToKeys: DomIdMap = new Map();

    parseElements({
      elements,
      nodes,
      tagHandlers,
      customParser,
      excludeTags,
      internalLinkNodes,
      nodeMap,
      domIdToKeys,
      parseFromCssClass,
    });

    resolveInternalLinks({
      internalLinkNodes,
      nodeMap,
      domIdToKeys,
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
