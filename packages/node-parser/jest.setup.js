const { customHtmlParser } = require('./src/parseHtml');
const {
  updateDefaultParseHtmlOptions,
} = require('../parser/src/__tests__/defaultHtmlParseOptions');

updateDefaultParseHtmlOptions({
  customHtmlParser,
});
