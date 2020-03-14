import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, IFrameNode } from '../nodes';

describe('parseHtml - iframe tests', () => {
  it('parse iframe', async () => {
    const source = 'http://www.google.com';
    const rawHtml = `<iframe src="${source}" height="200" width="300"></iframe>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.IFrame,
        path: ['iframe'],
        source,
        height: 200,
        width: 300,
      } as IFrameNode,
    ]);
  });
  it('will not parse iframe children', async () => {
    const source = 'http://www.google.com';
    const rawHtml = `<iframe src="${source}" height="200" width="300">this will not be parsed</iframe>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.IFrame,
        path: ['iframe'],
        source,
        height: 200,
        width: 300,
      } as IFrameNode,
    ]);
  });
});
