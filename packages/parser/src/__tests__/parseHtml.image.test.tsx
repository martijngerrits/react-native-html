import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, ImageNode, TextNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlArgs } from '../__mock__/defaultHtmlParseArgs';

describe('parseHtml - image tests', () => {
  it('parse image', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const rawHtml = `<img src="${source}" width="272" height="90" />`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

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
  it('parse image between text as three separate list items', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const text = 'abc';
    const rawHtml = `<div>${text}<img src="${source}" width="272" height="90" />${text}</div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinLink: false,
        isWithinTextContainer: false,
        isWithinList: false,
      } as TextNode,
      {
        type: NodeType.Image,
        key: getNodeKey({ index: 1 }),
        source,
        width: 272,
        height: 90,
      } as ImageNode,
      {
        content: text,
        type: NodeType.Text,
        key: getNodeKey({ index: 2 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinLink: false,
        isWithinTextContainer: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse image without width and height', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const rawHtml = `<img src="${source}" />`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

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
