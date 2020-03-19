import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, LinkNode, ImageNode, getNodeKey, generateNodeHash } from '../nodes';

describe('parserawHtml - link tests', () => {
  it('parse text link', async () => {
    const text = 'link';
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${text}</a>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey('', NodeType.Link, 0);

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        hash: generateNodeHash({ nodeType: NodeType.Link, index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            type: NodeType.Text,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.Text, index: 0 }),
            content: text,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: false,
            isWithinLink: true,
            isWithinList: false,
          } as TextNode,
        ],
      } as LinkNode,
    ]);
  });
  it('parse image link', async () => {
    const imageSource =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${imageHtml}</a>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey('', NodeType.Link, 0);

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        hash: generateNodeHash({ nodeType: NodeType.Link, index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            type: NodeType.Image,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.Image, index: 0 }),
            source: imageSource,
            width: 272,
            height: 90,
          } as ImageNode,
        ],
      } as LinkNode,
    ]);
  });
  it('parse text & image link', async () => {
    const text = 'check this out';
    const imageSource =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${text}${imageHtml}</a>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey('', NodeType.Link, 0);

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        hash: generateNodeHash({ nodeType: NodeType.Link, index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            content: text,
            type: NodeType.Text,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.Text, index: 0 }),
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinLink: true,
            isWithinTextContainer: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Image,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.Image, index: 1 }),
            source: imageSource,
            width: 272,
            height: 90,
          } as ImageNode,
        ],
      } as LinkNode,
    ]);
  });
});
