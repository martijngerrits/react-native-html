import { DomHandler, Parser } from 'htmlparser2-without-node-native';
// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';

import { parseElements, ElementParser } from './parseElement';
import { NodeBase } from './nodes';
import { TagHandler } from './parseTags';

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

interface ParseHtmlArgs {
  rawHtml: string;
  customElementParser?: ElementParser;
  tagHandlers?: TagHandler[];
  excludeTags?: Set<string>;
}

export async function parseHtml({
  rawHtml,
  customElementParser,
  tagHandlers,
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
}: ParseHtmlArgs): Promise<ParseHtmlResult> {
  try {
    const promise = new Promise<DomElement[]>((resolve, reject) => {
      const handler = new DomHandler((err, dom) => {
        if (err) {
          reject(err);
        } else {
          resolve(dom);
        }
      });
      const parser = new Parser(handler);
      parser.write(rawHtml);
      parser.done();
    });

    const elements = await promise;

    const nodes: NodeBase[] = [];

    parseElements({
      elements,
      nodes,
      tagHandlers,
      customElementParser,
      excludeTags,
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
