import { Parser, DomHandler } from 'htmlparser2';
import * as original from '@react-native-html/parser';

export const customHtmlParser = (html: string): Promise<original.DomElement[]> => {
  return new Promise<original.DomElement[]>((resolve, reject) => {
    const handler = new DomHandler((err, dom) => {
      if (err) {
        reject(err);
      } else {
        resolve((dom as unknown) as original.DomElement[]);
      }
    });
    const parser = new Parser(handler, { lowerCaseTags: true });
    parser.write(html);
    parser.done();
  });
};

export const parseHtml = (
  rawHtml: string,
  options: original.ParseHtmlOptions
): Promise<original.ParseHtmlResult> => {
  const nextOptions: original.ParseHtmlOptions = {
    ...options,
    customHtmlParser,
  };
  return original.parseHtml(rawHtml, nextOptions);
};
