/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const { Parser, DomHandler } = require('htmlparser2');
const { updateDefaultParseHtmlArgs } = require('../parser/src/__mock__/defaultHtmlParseArgs');

updateDefaultParseHtmlArgs({
  Parser,
  DomHandler,
});
