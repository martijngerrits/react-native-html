import { ResultType, SuccessResult, parseHtml } from '../parseHtml';
import {
  TextNode,
  NodeType,
  LinkNode,
  getNodeKey,
  ListNode,
  ListItemNode,
  TextContainerNode,
  ImageNode,
} from '../types/nodes';
import { getDefaultParseHtmlArgs } from './defaultHtmlParseArgs';

describe('parseHtml - text container tests', () => {
  it('parse text + a within p as text container', async () => {
    const pretext = 'Check this ';
    const link = 'link';
    const subtext = ' out!';
    const source = 'https://www.wikipedia.org';
    const rawHtml = `<p>${pretext}<a href="${source}">${link}</a>${subtext}</p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix2 = getNodeKey({ index: 1, keyPrefix });
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Link,
            source,
            isWithinTextContainer: true,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
                parentKey: keyPrefix2,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
                isWithinList: false,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
    ]);
  });
  it('parse text + <b> within p as text container', async () => {
    const pretext = 'Check this ';
    const link = 'bold';
    const subtext = ' out!';
    const rawHtml = `<p>${pretext}<b>${link}</b>${subtext}</p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
    ]);
  });
  it('parse text + <b> + <a> within p as text container', async () => {
    const pretext = 'Check this ';
    const bold = 'bold';
    const subtext = ' out! Also check this ';
    const finaltext = '!';
    const source = 'https://www.wikipedia.org';
    const link = 'link';
    const rawHtml = `<p>${pretext}<b>${bold}</b>${subtext}<a href="${source}">${link}</a>${finaltext}</p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix2 = getNodeKey({ index: 3, keyPrefix });
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            content: bold,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Link,
            key: getNodeKey({ index: 3, keyPrefix }),
            parentKey: keyPrefix,
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
                parentKey: keyPrefix2,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
                isWithinList: false,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: finaltext,
            type: NodeType.Text,
            key: getNodeKey({ index: 4, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
    ]);
  });
  it('non text container elements divides the group', async () => {
    const pretext = 'Check this ';
    const link = 'bold';
    const subtext = ' out!';
    const rawHtml = `<div>${pretext}<b>${link}</b>${subtext}<div></div>${pretext}<b>${link}</b>${subtext}</div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    expect(result.type).toBe(ResultType.Success);
    const createTextContainer = (index: number) => {
      const keyPrefix = getNodeKey({ index });
      return {
        type: NodeType.TextContainer,
        key: keyPrefix,
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      };
    };
    expect(result.nodes).toEqual([createTextContainer(0), createTextContainer(1)]);
  });
  it('parse <b> + <a> + text within div as text container', async () => {
    const bold = 'bold';
    const finaltext = 'final';
    const source = 'https://www.wikipedia.org';
    const link = 'link';
    const rawHtml = `<div><b>${bold}</b><a href="${source}">${link}</a>${finaltext}</div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix2 = getNodeKey({ index: 1, keyPrefix });
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            content: bold,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Link,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
                parentKey: keyPrefix2,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
                isWithinList: false,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: finaltext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
    ]);
  });
  it('can handle text containers inside list items', async () => {
    const rawHtml = `<ul class="noDisc marginBottom3em noDeco">
        <li>
          <strong>Lorem Ipsum:</strong>
          <a href="https://www.usage.com/">Usage</a>,
          <a href="https://www.common-examples.com/">Common examples</a>,
        </li>
      </ul>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefixLI = getNodeKey({ index: 0, keyPrefix });
    const keyPrefixTC = getNodeKey({ index: 0, keyPrefix: keyPrefixLI });
    const keyPrefixA1 = getNodeKey({ index: 2, keyPrefix: keyPrefixTC });
    const keyPrefixA2 = getNodeKey({ index: 4, keyPrefix: keyPrefixTC });
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
                type: NodeType.TextContainer,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefixLI }),
                parentKey: keyPrefixLI,
                isFirstChildInListItem: true,
                children: [
                  {
                    content: 'Lorem Ipsum:',
                    type: NodeType.Text,
                    key: getNodeKey({ index: 0, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: true,
                    isWithinTextContainer: true,
                    isWithinLink: false,
                    isWithinList: true,
                  } as TextNode,
                  {
                    content: ' ',
                    type: NodeType.Text,
                    key: getNodeKey({ index: 1, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: false,
                    isWithinTextContainer: true,
                    isWithinLink: false,
                    isWithinList: true,
                  } as TextNode,
                  {
                    type: NodeType.Link,
                    key: getNodeKey({ index: 2, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    source: 'https://www.usage.com/',
                    isWithinTextContainer: true,
                    children: [
                      {
                        content: 'Usage',
                        type: NodeType.Text,
                        key: getNodeKey({ index: 0, keyPrefix: keyPrefixA1 }),
                        parentKey: keyPrefixA1,
                        hasStrikethrough: false,
                        isUnderlined: false,
                        isItalic: false,
                        isBold: false,
                        isWithinTextContainer: true,
                        isWithinLink: true,
                        isWithinList: true,
                      } as TextNode,
                    ],
                  } as LinkNode,
                  {
                    content: ', ',
                    type: NodeType.Text,
                    key: getNodeKey({ index: 3, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: false,
                    isWithinTextContainer: true,
                    isWithinLink: false,
                    isWithinList: true,
                  } as TextNode,
                  {
                    type: NodeType.Link,
                    key: getNodeKey({ index: 4, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    source: 'https://www.common-examples.com/',
                    isWithinTextContainer: true,
                    children: [
                      {
                        content: 'Common examples',
                        type: NodeType.Text,
                        key: getNodeKey({ index: 0, keyPrefix: keyPrefixA2 }),
                        parentKey: keyPrefixA2,
                        hasStrikethrough: false,
                        isUnderlined: false,
                        isItalic: false,
                        isBold: false,
                        isWithinTextContainer: true,
                        isWithinLink: true,
                        isWithinList: true,
                      } as TextNode,
                    ],
                  } as LinkNode,
                  {
                    content: ', ',
                    type: NodeType.Text,
                    key: getNodeKey({ index: 5, keyPrefix: keyPrefixTC }),
                    parentKey: keyPrefixTC,
                    hasStrikethrough: false,
                    isUnderlined: false,
                    isItalic: false,
                    isBold: false,
                    isWithinTextContainer: true,
                    isWithinLink: false,
                    isWithinList: true,
                  } as TextNode,
                ],
              } as TextContainerNode,
            ],
          } as ListItemNode,
        ],
      } as ListNode,
    ]);
  });
  it('can detect that leading spaces do not constitute text containers', async () => {
    const rawHtml = `<div class="block__author--left">
        <a href="https://www.wikipedia.org/">
    <img src="https://i.picsum.photos/id/250/272/92.jpg">
        </a>
    </div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    expect(result.type).toBe(ResultType.Success);
    const keyPrefix = getNodeKey({ index: 0 });
    expect(result.nodes).toEqual([
      {
        type: NodeType.Link,
        key: getNodeKey({ index: 0 }),
        source: 'https://www.wikipedia.org/',
        isWithinTextContainer: false,
        children: [
          {
            type: NodeType.Image,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            source: 'https://i.picsum.photos/id/250/272/92.jpg',
          } as ImageNode,
        ],
      } as LinkNode,
    ]);
  });
  it('can add spaces between text container elements', async () => {
    const rawHtml = `<p>
    <strong>test</strong>
    <span>hallo</span>
    <a href="https://www.wikipedia.org/">abc</a>
  </p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    expect(result.type).toBe(ResultType.Success);
    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefixA = getNodeKey({ index: 4, keyPrefix });
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: 'test',
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: ' ',
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            content: 'hallo',
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: ' ',
            type: NodeType.Text,
            key: getNodeKey({ index: 3, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Link,
            key: getNodeKey({ index: 4, keyPrefix }),
            parentKey: keyPrefix,
            source: 'https://www.wikipedia.org/',
            isWithinTextContainer: true,
            children: [
              {
                content: 'abc',
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefixA }),
                parentKey: keyPrefixA,
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
                isWithinList: false,
              } as TextNode,
            ],
          } as LinkNode,
        ],
      },
    ]);
  });

  it('can combine nested text elements into a single text container', async () => {
    const pretext = 'Check this ';
    const link = 'bold';
    const subtext = ' out!';
    const rawHtml = `<p>${pretext}<span><b>${link}</b>${subtext}</span></p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;
    const keyPrefix = getNodeKey({ index: 0 });
    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 2, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
    ]);
  });

  it('can split text container by nested image', async () => {
    const pretext = 'Check ';
    const prelink = 'this ';
    const link = 'link';
    const subtext = ' out!';
    const rawHtml = `<div>${pretext}<span>${prelink}<img src="test-url" /><b>${link}</b>${subtext}</span></div>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefix2 = getNodeKey({ index: 2 });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 0 }),
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix }),
            parentKey: keyPrefix,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix }),
            parentKey: keyPrefix,
            content: prelink,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      },
      {
        type: NodeType.Image,
        key: getNodeKey({ index: 1 }),
        source: 'test-url',
      } as ImageNode,
      {
        type: NodeType.TextContainer,
        key: getNodeKey({ index: 2 }),
        children: [
          {
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
            parentKey: keyPrefix2,
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            key: getNodeKey({ index: 1, keyPrefix: keyPrefix2 }),
            parentKey: keyPrefix2,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
            isWithinList: false,
          } as TextNode,
        ],
      } as TextContainerNode,
    ]);
  });
});
