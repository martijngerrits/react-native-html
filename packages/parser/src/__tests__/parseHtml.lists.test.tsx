import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType } from '../nodes';

describe('parseHtml - list tests', () => {
  it('parse unordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const html = `<ul><li>${text1}</li><li>${text2}</li></ul>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ul'],
        style: {},
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            style: {},
            children: [
              {
                type: NodeType.Text,
                content: text1,
                path: ['ul', 'li', 'text'],
                style: {},
              },
            ],
          },
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            style: {},
            children: [
              {
                type: NodeType.Text,
                content: text2,
                path: ['ul', 'li', 'text'],
                style: {},
              },
            ],
          },
        ],
      },
    ]);
  });

  it('parse ordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const html = `<ol><li>${text1}</li><li>${text2}</li></ol>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ol'],
        style: {},
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ol', 'li'],
            style: {},
            children: [
              {
                type: NodeType.Text,
                content: text1,
                path: ['ol', 'li', 'text'],
                style: {},
              },
            ],
          },
          {
            type: NodeType.ListItem,
            path: ['ol', 'li'],
            style: {},
            children: [
              {
                type: NodeType.Text,
                content: text2,
                path: ['ol', 'li', 'text'],
                style: {},
              },
            ],
          },
        ],
      },
    ]);
  });

  it('can handle multiple elements inside list items', async () => {
    const header1 = 'header 1';
    const text1 = 'item 1';
    const html = `<ul><li><h3>${header1}</h3><p>${text1}</p></li></ul>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        path: ['ul'],
        style: {},
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            path: ['ul', 'li'],
            style: {},
            children: [
              {
                type: NodeType.Text,
                content: header1,
                path: ['ul', 'li', 'h3', 'text'],
                style: {},
              },
              {
                type: NodeType.Text,
                content: text1,
                path: ['ul', 'li', 'p', 'text'],
                style: {},
              },
            ],
          },
        ],
      },
    ]);
  });
});
