import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, ListItemNode, ListNode, getNodeKey, generateNodeHash } from '../nodes';

describe('parseHtml - list tests', () => {
  it('parse unordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ul><li>${text1}</li><li>${text2}</li></ul>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    const keyPrefix = getNodeKey('', NodeType.List, 0);
    const keyPrefix1 = getNodeKey(keyPrefix, NodeType.ListItem, 0);
    const keyPrefix2 = getNodeKey(keyPrefix, NodeType.ListItem, 1);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        hash: generateNodeHash({ nodeType: NodeType.List, index: 0 }),
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.ListItem, index: 0 }),
            children: [
              {
                type: NodeType.Text,
                content: text1,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix1,
                  nodeType: NodeType.Text,
                  index: 0,
                }),
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
              } as TextNode,
            ],
          },
          {
            type: NodeType.ListItem,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.ListItem, index: 1 }),
            children: [
              {
                type: NodeType.Text,
                content: text2,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix2,
                  nodeType: NodeType.Text,
                  index: 0,
                }),
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

  it('parse ordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ol><li>${text1}</li><li>${text2}</li></ol>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey('', NodeType.List, 0);
    const keyPrefix1 = getNodeKey(keyPrefix, NodeType.ListItem, 0);
    const keyPrefix2 = getNodeKey(keyPrefix, NodeType.ListItem, 1);

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        hash: generateNodeHash({ nodeType: NodeType.List, index: 0 }),
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.ListItem, index: 0 }),
            children: [
              {
                type: NodeType.Text,
                content: text1,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix1,
                  nodeType: NodeType.Text,
                  index: 0,
                }),
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
          {
            type: NodeType.ListItem,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.ListItem, index: 1 }),
            children: [
              {
                type: NodeType.Text,
                content: text2,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix2,
                  nodeType: NodeType.Text,
                  index: 0,
                }),
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

  it('can handle multiple elements inside list items', async () => {
    const header1 = 'header 1';
    const text1 = 'item 1';
    const rawHtml = `<ul><li><h3>${header1}</h3><p>${text1}</p></li></ul>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey('', NodeType.List, 0);
    const keyPrefix1 = getNodeKey(keyPrefix, NodeType.ListItem, 0);

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        hash: generateNodeHash({ nodeType: NodeType.List, index: 0 }),
        isOrdered: false,
        children: [
          {
            type: NodeType.ListItem,
            hash: generateNodeHash({ keyPrefix, nodeType: NodeType.ListItem, index: 0 }),
            children: [
              {
                type: NodeType.Text,
                content: header1,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix1,
                  nodeType: NodeType.Text,
                  index: 0,
                }),
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                header: 3,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
              } as TextNode,
              {
                type: NodeType.Text,
                content: text1,
                hash: generateNodeHash({
                  keyPrefix: keyPrefix1,
                  nodeType: NodeType.Text,
                  index: 1,
                }),
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
