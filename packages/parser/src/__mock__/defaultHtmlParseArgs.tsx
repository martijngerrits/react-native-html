import { ParseHtmlArgs } from '../parseHtml';

let parseArgs: Partial<ParseHtmlArgs> = {};

export const getDefaultParseHtmlArgs = () => parseArgs;
export const updateDefaultParseHtmlArgs = (update: Partial<ParseHtmlArgs>) => {
  parseArgs = update;
};
