/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const { Parser, DomHandler } = require('htmlparser2');
const {
  updateDefaultParseHtmlOptions,
} = require('../parser/src/__tests__/defaultHtmlParseOptions');

updateDefaultParseHtmlOptions({
  Parser,
  DomHandler,
});
