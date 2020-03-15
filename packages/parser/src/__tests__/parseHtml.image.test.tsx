import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, ImageNode, TextNode } from '../nodes';

describe('parseHtml - image tests', () => {
  it('parse image', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const rawHtml = `<img src="${source}" width="272" height="90" />`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        path: ['img'],
        source,
        width: 272,
        height: 90,
      } as ImageNode,
    ]);
  });
  it('parse image between text as three separate list items', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const text = 'abc';
    const rawHtml = `<div>${text}<img src="${source}" width="272" height="90" />${text}</div>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'text'],
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinLink: false,
        isWithinTextContainer: false,
      } as TextNode,
      {
        type: NodeType.Image,
        path: ['div', 'img'],
        source,
        width: 272,
        height: 90,
      } as ImageNode,
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'text'],
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinLink: false,
        isWithinTextContainer: false,
      } as TextNode,
    ]);
  });
  it('parse image without width and height', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const rawHtml = `<img src="${source}" />`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        path: ['img'],
        source,
      } as ImageNode,
    ]);
  });
});
