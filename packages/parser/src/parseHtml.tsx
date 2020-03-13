// eslint-disable-next-line import/no-extraneous-dependencies
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { DomHandler, Parser } from 'htmlparser2-without-node-native';
// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';

import { parseElement, ElementParser } from './parseElement';
import { NodeBase } from './nodes';
import { TagHandler, createDefaultTagHandlers } from './parseTags';

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

export async function parseHtml(
  rawHtml: string,
  providedHtmlStyles: Record<string, ViewStyle | TextStyle | ImageStyle> = {},
  customElementParser?: ElementParser,
  tagHandlers: TagHandler[] = createDefaultTagHandlers()
): Promise<ParseHtmlResult> {
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
    const htmlStyles = Object.keys(providedHtmlStyles).reduce((acc, key) => {
      return {
        ...acc,
        [key.toLowerCase()]: providedHtmlStyles[key],
      };
    }, {} as Record<string, ViewStyle | TextStyle>);

    elements.forEach(element => {
      parseElement(
        element,
        null,
        [],
        false,
        nodes,
        htmlStyles,
        {},
        tagHandlers,
        customElementParser
      );
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
