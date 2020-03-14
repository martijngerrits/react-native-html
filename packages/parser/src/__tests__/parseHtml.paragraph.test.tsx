import { ResultType, SuccessResult, parseHtml } from '../parseHtml';
import { TextNode, NodeType, LinkNode } from '../nodes';

describe('parseHtml - paragraph tests', () => {
  it('parse text + a within p as paragraph', async () => {
    const pretext = 'Check this ';
    const link = 'link';
    const subtext = ' out!';
    const source = 'https://www.wikipedia.org';
    const rawHtml = `<p>${pretext}<a href="${source}">${link}</a>${subtext}</p>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Paragraph,
        path: ['p'],
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
          } as TextNode,
          {
            type: NodeType.Link,
            path: ['p', 'a'],
            source,
            isInline: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                path: ['p', 'a', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: subtext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
          } as TextNode,
        ],
      },
    ]);
  });
  it('parse text + <b> within p as paragraph', async () => {
    const pretext = 'Check this ';
    const link = 'bold';
    const subtext = ' out!';
    const rawHtml = `<p>${pretext}<b>${link}</b>${subtext}</p>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.Paragraph,
        path: ['p'],
        children: [
          {
            content: pretext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
          } as TextNode,
          {
            type: NodeType.Text,
            path: ['p', 'b', 'text'],
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
          } as TextNode,
        ],
      },
    ]);
  });
});
