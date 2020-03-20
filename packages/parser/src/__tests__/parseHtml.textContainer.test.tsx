import { ResultType, SuccessResult, parseHtml } from '../parseHtml';
import { TextNode, NodeType, LinkNode, getNodeKey } from '../nodes';

describe('parseHtml - text container tests', () => {
  it('parse text + a within p as text container', async () => {
    const pretext = 'Check this ';
    const link = 'link';
    const subtext = ' out!';
    const source = 'https://www.wikipedia.org';
    const rawHtml = `<p>${pretext}<a href="${source}">${link}</a>${subtext}</p>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

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
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
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
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

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
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

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
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
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
    const rawHtml = `<p>${pretext}<b>${link}</b>${subtext}<div></div>${pretext}<b>${link}</b>${subtext}</p>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

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
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

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
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                key: getNodeKey({ index: 0, keyPrefix: keyPrefix2 }),
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
});
