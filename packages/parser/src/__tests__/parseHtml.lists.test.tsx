import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, ListItemNode, ListNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlArgs } from './defaultHtmlParseArgs';

describe('parseHtml - list tests', () => {
  it('parse unordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ul><li>${text1}</li><li>${text2}</li></ul>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix1 = getNodeKey({ index: 0, keyPrefix });
    const keyPrefix2 = getNodeKey({ index: 1, keyPrefix });

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        key: getNodeKey({ index: 0 }),
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                type: NodeType.Text,
                content: text1,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix1 }),
                parentKey: keyPrefix1,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
              } as TextNode,
            ],
          },
          {
            type: NodeType.ListItem,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                type: NodeType.Text,
                content: text2,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
                parentKey: keyPrefix2,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });

  it('parse ordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ol><li>${text1}</li><li>${text2}</li></ol>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix1 = getNodeKey({ index: 0, keyPrefix });
    const keyPrefix2 = getNodeKey({ index: 1, keyPrefix });

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        key: getNodeKey({ index: 0 }),
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                type: NodeType.Text,
                content: text1,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix1 }),
                parentKey: keyPrefix1,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
              } as TextNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                type: NodeType.Text,
                content: text2,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
                parentKey: keyPrefix2,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });

  it('can handle multiple elements inside list items', async () => {
    const header1 = 'header 1';
    const text1 = 'item 1';
    const rawHtml = `<ul><li><h3>${header1}</h3><p>${text1}</p></li></ul>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix1 = getNodeKey({ index: 0, keyPrefix });

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        key: getNodeKey({ index: 0 }),
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                type: NodeType.Text,
                content: header1,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix1 }),
                parentKey: keyPrefix1,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                header: 3,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
              } as TextNode,
              {
                type: NodeType.Text,
                content: text1,
                key: getNodeKey({ index: 1, keyPrefix: keyPrefix1 }),
                parentKey: keyPrefix1,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });
});
