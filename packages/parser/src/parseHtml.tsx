import { DomHandler, Parser } from 'htmlparser2-without-node-native';

import { NodeBase, NodeReferences } from './types/nodes';
import { resolveInternalLinks } from './resolveInternalLinks';
import { CustomParser } from './types/customParser';
import { parseElements } from './parseElements';
import { DomElementBase, DomElement } from './types/elements';
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
   * This defines how tags are converted to the corresponding node.
   * You can extend the resulting object of createDefaultParserPerTag.
   */
  parserPerTag?: ParserPerTag;
  /**
   * Tags to be excluded from displaying
   */
  excludeTags?: Set<string>;
  /**
   * if provided, it only parses the children of the first element with the provided css class (without '.')
   */
  parseFromCssClass?: string;
  /**
   * if provided, can customize how an html string gets parsed into DomElements
   */
  customHtmlParser?: (rawHtml: string) => Promise<DomElement[]>;

  /**
   * If true, it treats images as a block element and not as an inline element.
   * As a block element, the image will be displayed on its own row.
   * The default value is true.
   */
  treatImageAsBlockElement?: boolean;
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
    customHtmlParser,
    treatImageAsBlockElement = true,
  }: ParseHtmlOptions = {}
): Promise<ParseHtmlResult> {
  try {
    const promise = customHtmlParser
      ? customHtmlParser(rawHtml)
      : new Promise<DomElementBase<T>[]>((resolve, reject) => {
          const handler = new DomHandler((err, dom) => {
            if (err) {
              reject(err);
            } else {
              resolve(dom as DomElementBase<T>[]);
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
    const blockManager = createBlockManager(treatImageAsBlockElement);

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
