import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, NodeBase, IFrameNode, TextNode, getNodeKey } from '../types/nodes';
import { CustomParser } from '../types/customParser';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

const MyNodeTypes = {
  ...NodeType,
  Facebook: 'Facebook',
  Magic: 'Magic',
};
interface FacebookNode extends NodeBase {
  type: 'Facebook';
  source: string;
}
interface MagicNode extends NodeBase {
  type: 'Magic';
}

describe('parseHtml - custom parser tests', () => {
  it('parse with custom parser', async () => {
    const src = 'https://www.facebook.com';
    const rawHtml = `<iframe src="${src}" height="200" width="300"></iframe>`;

    const customParser: CustomParser = ({ element }) => {
      const source = element.attribs?.src ?? '';
      if (element.name === 'iframe' && source.startsWith(src)) {
        return {
          node: {
            type: MyNodeTypes.Facebook,
            source,
          } as FacebookNode,
        };
      }
      return undefined; // default handlers
    };
    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      customParser,
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: MyNodeTypes.Facebook,
        key: getNodeKey({ index: 0 }),
        source: src,
      },
    ]);
  });
  it('parse with custom parser and use default parser when no node is returned', async () => {
    const src = 'https://www.facebook.com';
    const src2 = 'https://www.instagram.com';
    const rawHtml = `<iframe src="${src}" height="200" width="300"></iframe><iframe src="${src2}" height="200" width="300"></iframe>`;

    const customParser: CustomParser = ({ element }) => {
      const source = element.attribs?.src ?? '';
      if (element.name === 'iframe' && source.startsWith(src)) {
        return {
          node: {
            type: MyNodeTypes.Facebook,
            source,
          } as FacebookNode,
        };
      }
      return undefined; // default handlers
    };
    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      customParser,
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: MyNodeTypes.Facebook,
        key: getNodeKey({ index: 0 }),
        source: src,
      } as FacebookNode,
      {
        type: NodeType.IFrame,
        key: getNodeKey({ index: 1 }),
        source: src2,
        height: 200,
        width: 300,
      } as IFrameNode,
    ]);
  });
  it('parse with custom parser and no longer parse children', async () => {
    const rawHtml = `<p>Below the custom node 'Magic':</p>
    <div class="magic">stuff you don't want to render but show something else in stead</div>
    <p>Normal text again!</p>`;

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const customParser: CustomParser = ({ hasClassName }) => {
      if (hasClassName('magic')) {
        return {
          parsed: true,
          node: {
            type: 'Magic',
          } as MagicNode,
          continueParsingChildren: false,
        };
      }
      return undefined;
    };

    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      customParser,
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        content: "Below the custom node 'Magic':",
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: true,
      } as TextNode,
      {
        type: MyNodeTypes.Magic,
        key: getNodeKey({ index: 1 }),
      } as MagicNode,
      {
        content: 'Normal text again!',
        type: NodeType.Text,
        key: getNodeKey({ index: 2 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: true,
      } as TextNode,
    ]);
  });
});
