/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const { customHtmlParser } = require('./src/parseHtml');
const {
  updateDefaultParseHtmlOptions,
} = require('../parser/src/__tests__/defaultHtmlParseOptions');

updateDefaultParseHtmlOptions({
  customHtmlParser,
});
