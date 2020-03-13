import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType } from '../nodes';

describe('parseHtml - image tests', () => {
  it('parse image', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const html = `<img src="${source}" width="272" height="90" />`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        hasTextSibling: false,
        path: ['img'],
        source,
        style: {},
        width: 272,
        height: 90,
      },
    ]);
  });
  it('parse nested image with style', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const html = `<div><img src="${source}" width="272" height="90" /></div>`;
    const result = (await parseHtml(html, {
      div: {
        padding: 10,
      },
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        path: ['div', 'img'],
        source,
        style: { padding: 10 },
        width: 272,
        height: 90,
        hasTextSibling: false,
      },
    ]);
  });
  it('parse image between text as three separate list items', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const text = 'abc';
    const html = `<div>${text}<img src="${source}" width="272" height="90" />${text}</div>`;
    const result = (await parseHtml(html, {
      div: {
        padding: 10,
      },
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'text'],
        style: { padding: 10 },
      },
      {
        type: NodeType.Image,
        path: ['div', 'img'],
        source,
        style: { padding: 10 },
        width: 272,
        height: 90,
        hasTextSibling: true,
      },
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'text'],
        style: { padding: 10 },
      },
    ]);
  });
  it('parse image without width and height', async () => {
    const source =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const html = `<img src="${source}" />`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Image,
        hasTextSibling: false,
        path: ['img'],
        source,
        style: {},
      },
    ]);
  });
});
