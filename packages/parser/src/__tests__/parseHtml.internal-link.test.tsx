import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, getNodeKey, InternalLinkNode } from '../types/nodes';
import { getDefaultParseHtmlArgs } from '../__mock__/defaultHtmlParseArgs';

describe('parserawHtml - internal link tests', () => {
  it('parse internal link', async () => {
    const text = 'internal link';
    const domId = 'my-element';
    const rawHtml = `<a href="#${domId}">${text}</a><div id="${domId}">Check this out</div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.InternalLink,
        key: getNodeKey({ index: 0 }),
        domId,
        targetKey: getNodeKey({ index: 1 }),
        isWithinTextContainer: false,
        hasResolvedTarget: true,
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
      } as InternalLinkNode,
      {
        type: NodeType.Text,
        key: getNodeKey({ index: 1 }),
        content: 'Check this out',
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        isLinkedTo: true,
      } as TextNode,
    ]);
  });
  it('parse internal link with closest ancestor having dom id', async () => {
    const text = 'internal link';
    const domId = 'my-element';
    const rawHtml = `<a href="#${domId}">${text}</a><div id="${domId}"><p><div>Check this out</div></p></div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.InternalLink,
        key: getNodeKey({ index: 0 }),
        domId,
        targetKey: getNodeKey({ index: 1 }),
        isWithinTextContainer: false,
        hasResolvedTarget: true,
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
      } as InternalLinkNode,
      {
        type: NodeType.Text,
        key: getNodeKey({ index: 1 }),
        content: 'Check this out',
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        isLinkedTo: true,
      } as TextNode,
    ]);
  });
  it('parse internal link even if target not found by dom id', async () => {
    const text = 'internal link';
    const domId = 'my-element';
    const rawHtml = `<a href="#${domId}">${text}</a><div id="${domId}"></div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.InternalLink,
        key: getNodeKey({ index: 0 }),
        domId,
        targetKey: '',
        isWithinTextContainer: false,
        hasResolvedTarget: false,
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
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      } as InternalLinkNode,
    ]);
  });
});
