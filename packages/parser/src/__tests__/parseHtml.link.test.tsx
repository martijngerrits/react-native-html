import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, LinkNode, ImageNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

describe('parserawHtml - link tests', () => {
  it('parse text link', async () => {
    const text = 'link';
    const source = 'https://www.google.com/';
    const rawHtml = `<a href="${source}">${text}</a>`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
            canBeTextContainerBase: true,
            isAfterHeader: false,
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
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
    const rawHtml = `<a href="${source}">${text}<div>${imageHtml}</div></a>`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
            canBeTextContainerBase: true,
            isAfterHeader: false,
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
  // TODO: test abc <a href="#">zyx<div>test</div>test 123 </a>abc
  // that is valid html5. The div creates a new block, but is inside a link. This should split it into two link nodes
  // 1) text container 1 -> 'test abc [link]zyx[/link]'
  // 2) link -> 'test'
  // 3) text container 2 -> '[link]test 123[/link] abc'
});
