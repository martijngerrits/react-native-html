import { Parser, DomHandler } from 'htmlparser2';
import * as originalParser from '@react-native-html/parser';

export const parseHtml = (args: originalParser.ParseHtmlArgs) => {
  const nextArgs: originalParser.ParseHtmlArgs = {
    ...args,
    Parser: args.Parser ?? Parser,
    DomHandler: args.DomHandler ?? DomHandler,
  };
  return originalParser.parseHtml(nextArgs);
};
