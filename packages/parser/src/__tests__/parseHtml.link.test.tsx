import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType } from '../nodes';

describe('parseHtml - link tests', () => {
  it('parse text link', async () => {
    const text = 'link';
    const source = 'https://www.google.com/';
    const html = `<a href="${source}">${text}</a>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        path: ['a'],
        source,
        style: {},
        hasTextSibling: false,
        hasOnlyTextChildren: true,
        children: [
          {
            content: text,
            type: NodeType.Text,
            path: ['a', 'text'],
            style: {},
          },
        ],
      },
    ]);
  });
  it('parse image link', async () => {
    const imageSource =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const html = `<a href="${source}">${imageHtml}</a>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        path: ['a'],
        source,
        style: {},
        hasTextSibling: false,
        hasOnlyTextChildren: false,
        children: [
          {
            type: NodeType.Image,
            path: ['a', 'img'],
            source: imageSource,
            hasTextSibling: false,
            style: {},
            width: 272,
            height: 90,
          },
        ],
      },
    ]);
  });
  it('parse text & image link', async () => {
    const text = 'check this out';
    const imageSource =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const html = `<a href="${source}">${text}${imageHtml}</a>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        path: ['a'],
        source,
        style: {},
        hasTextSibling: false,
        hasOnlyTextChildren: false,
        children: [
          {
            content: text,
            type: NodeType.Text,
            path: ['a', 'text'],
            style: {},
          },
          {
            type: NodeType.Image,
            path: ['a', 'img'],
            source: imageSource,
            hasTextSibling: true,
            style: {},
            width: 272,
            height: 90,
          },
        ],
      },
    ]);
  });
  it('parse link between text elements', async () => {
    const pretext = 'check';
    const linkText = 'this';
    const subtext = 'out';

    const source = 'https://www.google.com/';
    const html = `<p>${pretext}<a href="${source}">${linkText}</a>${subtext}</p>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: pretext,
        type: NodeType.Text,
        path: ['p', 'text'],
        style: {},
      },
      {
        type: NodeType.Link,
        path: ['p', 'a'],
        source,
        style: {},
        hasTextSibling: true,
        hasOnlyTextChildren: true,
        children: [
          {
            content: linkText,
            type: NodeType.Text,
            path: ['p', 'a', 'text'],
            style: {},
          },
        ],
      },
      {
        content: subtext,
        type: NodeType.Text,
        path: ['p', 'text'],
        style: {},
      },
    ]);
  });
});
