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

export const BLOCK_TAGS = new Set([
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
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'noscript',
  'ol',
  'p',
  'pre', // preserves both spaces and line breaks
  'section',
  'table',
  'tfoot',
  'ul',
  'video',
]);

export const INLINE_TAGS = new Set([
  'a',
  'abbr',
  'acronym',
  'b',
  'bdo',
  'big',
  'br',
  'wbr',
  'nobr',
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

export enum LayoutRenderingContext {
  InlineFormattingContext,
  BlockFormattingContext,
}

/**
 * when a context is formed:
 * - if any child is a block tag, it creates a block context.
 * - if all children are inline tags or text nodes, it creates an inline formatting tag.
 * - Within block formatting context, an inline tag or a text node or a group of inline tag and/or text node siblings will form together an anonymous block.
 *   Within this anonymous block, the inline formatting context applies.
 *
 * Example:
 * - <div><div>block 1</div><div>block 2</div></div>
 *    --> root div contains two blocks (div, div)
 * - <div><b>bold</b> test<div>block 2</div></div>
 *    --> root div contains  two blocks (anonymous block --> '<b><b>bold</b> test', div)
 *    --> anonymous block has inline formatting context
 */

export const BOLD_TAGS = new Set(['b', 'strong']);
export const ITALIC_TAGS = new Set(['i', 'em']);
export const UNDERLINE_TAGS = new Set(['ins', 'u']);
export const STRIKETHROUGH_TAGS = new Set(['strike', 'del']);
export const HEADER_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
export const LINK_TAGS = new Set(['a']);
export const LIST_TAGS = new Set(['ol', 'ul']);
export const BREAK_TAGS = new Set(['br']);

export const getHeaderNumber = (pathName: string): number | undefined => {
  if (HEADER_TAGS.has(pathName)) {
    try {
      return parseInt(pathName.substr(1), 10);
    } catch (err) {
      // do nothing
    }
  }
  return undefined;
};
