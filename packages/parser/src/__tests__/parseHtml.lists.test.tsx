import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import {
  NodeType,
  TextNode,
  ListItemNode,
  ListNode,
  getNodeKey,
  ImageNode,
  TextContainerNode,
} from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

describe('parseHtml - list tests', () => {
  it('parse unordered list', async () => {
    const text1 = 'item 1';
    const text2 = 'item 2';
    const rawHtml = `<ul><li>${text1}</li><li>${text2}</li></ul>`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
                canBeTextContainerBase: true,
                isAfterHeader: false,
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
                canBeTextContainerBase: true,
                isAfterHeader: false,
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
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
                canBeTextContainerBase: true,
                isAfterHeader: false,
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
                canBeTextContainerBase: true,
                isAfterHeader: false,
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
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
                canBeTextContainerBase: false,
                isAfterHeader: false,
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
                canBeTextContainerBase: true,
                isAfterHeader: true,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });

  it('image list items', async () => {
    const rawHtml = `
    <ol class="bullets">
    <li><b>Large Image 1:</b><div><img src="https://picsum.photos/seed/picsum/1200/800" /></div></li>
    <li><b>Large Image 2:</b><span><img src="https://picsum.photos/seed/picsum/1200/800" /></span></li>
    </ol>
    `;
    const result = (await parseHtml(rawHtml, {
      ...getDefaultParseHtmlOptions(),
      treatImageAsBlockElement: false,
    })) as SuccessResult;
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        key: getNodeKey({ index: 0 }),
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            key: '0_0',
            parentKey: '0',
            children: [
              {
                type: NodeType.Text,
                content: 'Large Image 1:',
                key: '0_0_0',
                parentKey: '0_0',
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: true,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
                canBeTextContainerBase: false,
                isAfterHeader: false,
              } as TextNode,
              {
                type: NodeType.Image,
                key: '0_0_1',
                parentKey: '0_0',
                source: 'https://picsum.photos/seed/picsum/1200/800',
              } as ImageNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            key: '0_1',
            parentKey: '0',
            children: [
              {
                type: NodeType.TextContainer,
                key: '0_1_0',
                parentKey: '0_1',
                isFirstChildInListItem: true,
                isAfterHeader: false,
                children: [
                  {
                    type: NodeType.Text,
                    content: 'Large Image 2:',
                    key: '0_1_0_0',
                    parentKey: '0_1_0',
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: true,
                    isWithinLink: false,
                    isWithinTextContainer: true,
                    isWithinList: true,
                    canBeTextContainerBase: false,
                    isAfterHeader: false,
                  } as TextNode,
                  {
                    type: NodeType.Image,
                    key: '0_1_0_1',
                    parentKey: '0_1_0',
                    source: 'https://picsum.photos/seed/picsum/1200/800',
                  } as ImageNode,
                ],
              } as TextContainerNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });

  it('complex list example', async () => {
    const loremIpsum =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const rawHtml = `
    <ol class="bullets">
    <li><b>Title 1:</b> ${loremIpsum}</li>
    <li><b>Title 2:</b> ${loremIpsum}</li>
    <li><b>Large Image 3:</b><div><img src="https://picsum.photos/seed/picsum/1200/800" /></div></li>
    <li><h3>Header Title 4:</h3> ${loremIpsum}</li>
    </ol>
    `;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    expect(result.nodes).toEqual([
      {
        type: NodeType.List,
        key: getNodeKey({ index: 0 }),
        isOrdered: true,
        children: [
          {
            type: NodeType.ListItem,
            key: '0_0',
            parentKey: '0',
            children: [
              {
                type: NodeType.TextContainer,
                key: '0_0_0',
                parentKey: '0_0',
                isFirstChildInListItem: true,
                isAfterHeader: false,
                children: [
                  {
                    type: NodeType.Text,
                    content: 'Title 1:',
                    key: '0_0_0_0',
                    parentKey: '0_0_0',
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: true,
                    isWithinLink: false,
                    isWithinTextContainer: true,
                    isWithinList: true,
                    canBeTextContainerBase: false,
                    isAfterHeader: false,
                  } as TextNode,

                  {
                    type: NodeType.Text,
                    content: ` ${loremIpsum}`,
                    key: '0_0_0_1',
                    parentKey: '0_0_0',
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: false,
                    isWithinLink: false,
                    isWithinTextContainer: true,
                    isWithinList: true,
                    canBeTextContainerBase: true,
                    isAfterHeader: false,
                  } as TextNode,
                ],
              } as TextContainerNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            key: '0_1',
            parentKey: '0',
            children: [
              {
                type: NodeType.TextContainer,
                key: '0_1_0',
                parentKey: '0_1',
                isFirstChildInListItem: true,
                isAfterHeader: false,
                children: [
                  {
                    type: NodeType.Text,
                    content: 'Title 2:',
                    key: '0_1_0_0',
                    parentKey: '0_1_0',
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: true,
                    isWithinLink: false,
                    isWithinTextContainer: true,
                    isWithinList: true,
                    canBeTextContainerBase: false,
                    isAfterHeader: false,
                  } as TextNode,

                  {
                    type: NodeType.Text,
                    content: ` ${loremIpsum}`,
                    key: '0_1_0_1',
                    parentKey: '0_1_0',
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: false,
                    isWithinLink: false,
                    isWithinTextContainer: true,
                    isWithinList: true,
                    canBeTextContainerBase: true,
                    isAfterHeader: false,
                  } as TextNode,
                ],
              } as TextContainerNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            key: '0_2',
            parentKey: '0',
            children: [
              {
                type: NodeType.Text,
                content: 'Large Image 3:',
                key: '0_2_0',
                parentKey: '0_2',
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: true,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
                canBeTextContainerBase: false,
                isAfterHeader: false,
              } as TextNode,
              {
                type: NodeType.Image,
                key: '0_2_1',
                parentKey: '0_2',
                source: 'https://picsum.photos/seed/picsum/1200/800',
              } as ImageNode,
            ],
          } as ListItemNode,
          {
            type: NodeType.ListItem,
            key: '0_3',
            parentKey: '0',
            children: [
              {
                type: NodeType.Text,
                content: 'Header Title 4:',
                key: '0_3_0',
                parentKey: '0_3',
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                header: 3,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                isFirstChildInListItem: true,
                canBeTextContainerBase: false,
                isAfterHeader: false,
              } as TextNode,
              {
                type: NodeType.Text,
                content: loremIpsum,
                key: '0_3_1',
                parentKey: '0_3',
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinLink: false,
                isWithinTextContainer: false,
                isWithinList: true,
                canBeTextContainerBase: true,
                isAfterHeader: true,
              } as TextNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });
});
