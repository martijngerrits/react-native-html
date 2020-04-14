import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, getNodeKey, isTextNode } from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';
import { LinkNode } from '../../../renderer/src';

describe('parseHtml - br tests', () => {
  it('parse br as \\n', async () => {
    const rawHtml = '<p><br /></p><p>hallo dit is een test</p>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: '\n',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 1 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('complex break example', async () => {
    const rawHtml = `<p class="block__author__bio">
    Author name is&nbsp;job title and job description
<br>
<br><b>Contact</b>
<br><a href="https://www.wikipedia.org" target="_blank" rel="noopener">Website</a>
<br><a href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a>
</p>`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    const keyPrefix = getNodeKey({ index: 0 });
    const keyPrefixA1 = getNodeKey({ index: 2, keyPrefix });
    const keyPrefixA2 = getNodeKey({ index: 4, keyPrefix });

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes[0].type).toEqual(NodeType.TextContainer);

    const children = result.nodes[0].children?.map(child => {
      const content = isTextNode(child)
        ? child.content.replace(/[\n\r]/g, '{newline}').replace(/\s/g, ' ')
        : undefined;
      if (content) {
        return {
          ...child,
          content,
        };
      }
      return child;
    });

    expect(children).toEqual([
      {
        content: 'Author name is job title and job description {newline}{newline}',
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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
      {
        content: 'Contact {newline}',
        type: NodeType.Text,
        key: getNodeKey({ index: 1, keyPrefix }),
        parentKey: keyPrefix,
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: true,
        isWithinTextContainer: true,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
      {
        source: 'https://www.wikipedia.org',
        type: NodeType.Link,
        key: getNodeKey({ index: 2, keyPrefix }),
        parentKey: keyPrefix,
        isWithinTextContainer: true,
        children: [
          {
            content: 'Website',
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix: keyPrefixA1 }),
            parentKey: keyPrefixA1,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: true,
            isWithinList: false,
            canBeTextContainerBase: true,
            isAfterHeader: false,
          } as TextNode,
        ],
      } as LinkNode,
      {
        content: ' {newline}',
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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
      {
        source: 'https://www.instagram.com',
        type: NodeType.Link,
        key: getNodeKey({ index: 4, keyPrefix }),
        parentKey: keyPrefix,
        isWithinTextContainer: true,
        children: [
          {
            content: 'Instagram',
            type: NodeType.Text,
            key: getNodeKey({ index: 0, keyPrefix: keyPrefixA2 }),
            parentKey: keyPrefixA2,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: true,
            isWithinList: false,
            canBeTextContainerBase: true,
            isAfterHeader: false,
          } as TextNode,
        ],
      } as LinkNode,
    ]);
  });
});
