import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, ImageNode, getNodeKey, TextNode, TextContainerNode } from '../types/nodes';
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
  it('with treatImageAsBlockElement = true, parse image between text as three separate nodes', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const text = 'abc';
    const rawHtml = `<div>${text}<img src="${source}" />${text}</div>`;
    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      treatImageAsBlockElement: true,
    })) as SuccessResult;

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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
      {
        type: NodeType.Image,
        key: getNodeKey({ index: 1 }),
        source,
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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('with treatImageAsBlockElement = false, parse image as text container child', async () => {
    const source = 'https://i.picsum.photos/id/250/272/92.jpg';
    const text = 'abc';
    const rawHtml = `<div>${text}<img src="${source}" />${text}</div>`;
    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      treatImageAsBlockElement: false,
    })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        key: getNodeKey({ index: 0 }),
        type: NodeType.TextContainer,
        isAfterHeader: false,
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
            isWithinLink: false,
            isWithinTextContainer: true,
            isWithinList: false,
            canBeTextContainerBase: true,
            isAfterHeader: false,
          } as TextNode,
          {
            type: NodeType.Image,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            source,
          } as ImageNode,
          {
            content: text,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinLink: false,
            isWithinTextContainer: true,
            isWithinList: false,
            canBeTextContainerBase: true,
            isAfterHeader: false,
          } as TextNode,
        ],
      } as TextContainerNode,
    ]);
  });
});
