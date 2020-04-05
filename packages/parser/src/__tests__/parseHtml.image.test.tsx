import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, ImageNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

describe('parseHtml - image tests', () => {
  it('parse image', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const rawHtml = `<img src="${source}" width="272" height="90" />`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        key: getNodeKey({ index: 0 }),
        source,
        width: 272,
        height: 90,
      } as ImageNode,
    ]);
  });
  it('parse image without width and height', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const rawHtml = `<img src="${source}" />`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        key: getNodeKey({ index: 0 }),
        source,
      } as ImageNode,
    ]);
  });
});
