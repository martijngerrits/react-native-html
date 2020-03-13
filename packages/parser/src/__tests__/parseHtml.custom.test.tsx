import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, NodeBase } from '../nodes';
import { ElementParserArgs } from '../parseElement';

const MyNodeTypes = {
  ...NodeType,
  Facebook: 'Facebook',
};
interface FacebookNode extends NodeBase {
  type: 'Facebook';
  source: string;
}

describe('parseHtml - custom parser tests', () => {
  it('parse with custom parser', async () => {
    const src = 'https://www.facebook.com';
    const html = `<iframe src="${src}" height="200" width="300"></iframe>`;

    const customParser = ({ element, path, style }: ElementParserArgs): NodeBase | undefined => {
      const source = element.attribs?.src ?? '';
      if (element.name === 'iframe' && source.startsWith(src)) {
        return {
          type: MyNodeTypes.Facebook,
          source,
          path,
          style,
        } as FacebookNode;
      }
      return undefined; // default handlers
    };
    const result = (await parseHtml(html, {}, customParser)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: MyNodeTypes.Facebook,
        path: ['iframe'],
        source: src,
        style: {},
      },
    ]);
  });
  it('parse with custom parser and use default parser when no node is returned', async () => {
    const src = 'https://www.facebook.com';
    const src2 = 'https://www.instagram.com';
    const html = `<iframe src="${src}" height="200" width="300"></iframe><iframe src="${src2}" height="200" width="300"></iframe>`;

    const customParser = ({ element, path, style }: ElementParserArgs): NodeBase | undefined => {
      const source = element.attribs?.src ?? '';
      if (element.name === 'iframe' && source.startsWith(src)) {
        return {
          type: MyNodeTypes.Facebook,
          source,
          path,
          style,
        } as FacebookNode;
      }
      return undefined; // default handlers
    };
    const result = (await parseHtml(html, {}, customParser)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: MyNodeTypes.Facebook,
        path: ['iframe'],
        source: src,
        style: {},
      },
      {
        type: NodeType.IFrame,
        path: ['iframe'],
        source: src2,
        height: 200,
        width: 300,
        style: {},
      },
    ]);
  });
});
