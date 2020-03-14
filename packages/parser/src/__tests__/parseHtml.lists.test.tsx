import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, ListItemNode, ListNode } from '../nodes';

describe('parseHtml - list tests', () => {
  it('parse unordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ul><li>${text1}</li><li>${text2}</li></ul>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ul'],
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            children: [
              {
                type: NodeType.Text,
                content: text1,
                path: ['ul', 'li', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
              } as TextNode,
            ],
          },
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            children: [
              {
                type: NodeType.Text,
                content: text2,
                path: ['ul', 'li', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
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
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ol'],
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ol', 'li'],
            children: [
              {
                type: NodeType.Text,
                content: text1,
                path: ['ol', 'li', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
              } as TextNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            path: ['ol', 'li'],
            children: [
              {
                type: NodeType.Text,
                content: text2,
                path: ['ol', 'li', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
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
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ul'],
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            children: [
              {
                type: NodeType.Text,
                content: header1,
                path: ['ul', 'li', 'h3', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                header: 3,
              } as TextNode,
              {
                type: NodeType.Text,
                content: text1,
                path: ['ul', 'li', 'p', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });
});
