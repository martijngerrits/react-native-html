import { ParseHtmlOptions } from '../parseHtml';

let parseArgs: Partial<ParseHtmlOptions> = {};

export const getDefaultParseHtmlOptions = () => parseArgs;
export const updateDefaultParseHtmlOptions = (update: Partial<ParseHtmlOptions>) => {
  parseArgs = update;
};
