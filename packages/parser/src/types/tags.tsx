export const TEXT_FORMATTING_TAGS = [
  'b',
  'strong',
  'i',
  'em',
  'mark',
  'small',
  'del',
  'ins',
  'sub',
  'sup',
  'strike',
  'u',
];
/*
const BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'canvas',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1>-<h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'noscript',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tfoot',
  'ul',
  'video',
]);

const INLINE_TAGS = new Set([
  'a',
  'abbr',
  'acronym',
  'b',
  'bdo',
  'big',
  'br',
  'button',
  'cite',
  'code',
  'dfn',
  'em',
  'i',
  'img',
  'input',
  'kbd',
  'label',
  'map',
  'object',
  'output',
  'q',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'textarea',
  'time',
  'tt',
  'var',
]);
*/

export const BOLD_PATH_NAMES = new Set(['b', 'strong']);
export const ITALIC_PATH_NAMES = new Set(['i', 'em']);
export const UNDERLINE_PATH_NAMES = new Set(['ins', 'u']);
export const STRIKETHROUGH_PATH_NAMES = new Set(['strike', 'del']);
export const HEADER_PATH_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
export const TEXT_CONTAINER_PATH_NAMES = new Set([
  ...TEXT_FORMATTING_TAGS,
  'a',
  'text',
  'br',
  'span',
  'wbr',
  'nobr',
]);

export const LINK_NAMES = new Set(['a']);
export const LIST_NAMES = new Set(['ol', 'ul']);

export const getHeaderNumber = (pathName: string): number | undefined => {
  if (HEADER_PATH_NAMES.has(pathName)) {
    try {
      return parseInt(pathName.substr(1), 10);
    } catch (err) {
      // do nothing
    }
  }
  return undefined;
};
