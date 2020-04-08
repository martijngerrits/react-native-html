import { ParseHtmlOptions } from '../parseHtml';

let parseArgs: Partial<ParseHtmlOptions> = {};

export const getDefaultParseHtmlOptions = (): ParseHtmlOptions => parseArgs;
export const updateDefaultParseHtmlOptions = (update: Partial<ParseHtmlOptions>): void => {
  parseArgs = update;
};
