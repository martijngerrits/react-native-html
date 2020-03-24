import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, LinkNode, ImageNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlArgs } from '../__mock__/defaultHtmlParseArgs';

describe('parserawHtml - link tests', () => {
  it('parse text link', async () => {
    const text = 'link';
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${text}</a>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        key: getNodeKey({ index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
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
    const imageSource = 'https://i.picsum.photos/id/250/272/92.jpg';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${imageHtml}</a>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        key: getNodeKey({ index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            type: NodeType.Image,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
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
    const imageSource = 'https://i.picsum.photos/id/250/272/92.jpg';
    const imageHtml = `<img src="${imageSource}" width="272" height="90" />`;
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${text}${imageHtml}</a>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        key: getNodeKey({ index: 0 }),
        source,
        isWithinTextContainer: false,
        children: [
          {
            content: text,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
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
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            source: imageSource,
            width: 272,
            height: 90,
          } as ImageNode,
        ],
      } as LinkNode,
    ]);
  });
});
