import { ResultType, SuccessResult, parseHtml } from '../parseHtml';
import { TextNode, NodeType, LinkNode } from '../nodes';

describe('parseHtml - text container tests', () => {
  it('parse text + a within p as text container', async () => {
    const pretext = 'Check this ';
    const link = 'link';
    const subtext = ' out!';
    const source = 'https://www.wikipedia.org';
    const rawHtml = `<p>${pretext}<a href="${source}">${link}</a>${subtext}</p>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
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
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            type: NodeType.Link,
            path: ['p', 'a'],
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                path: ['p', 'a', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
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
            isWithinTextContainer: true,
            isWithinLink: false,
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

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
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
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            type: NodeType.Text,
            path: ['p', 'b', 'text'],
            content: link,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
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

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
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
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            type: NodeType.Text,
            path: ['p', 'b', 'text'],
            content: bold,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            content: subtext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            type: NodeType.Link,
            path: ['p', 'a'],
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                path: ['p', 'a', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: finaltext,
            type: NodeType.Text,
            path: ['p', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
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

    const textContainerNode = {
      type: NodeType.TextContainer,
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
          isWithinTextContainer: true,
          isWithinLink: false,
        } as TextNode,
        {
          type: NodeType.Text,
          path: ['p', 'b', 'text'],
          content: link,
          hasStrikethrough: false,
          isUnderlined: false,
          isItalic: false,
          isBold: true,
          isWithinTextContainer: true,
          isWithinLink: false,
        } as TextNode,
        {
          content: subtext,
          type: NodeType.Text,
          path: ['p', 'text'],
          hasStrikethrough: false,
          isUnderlined: false,
          isItalic: false,
          isBold: false,
          isWithinTextContainer: true,
          isWithinLink: false,
        } as TextNode,
      ],
    };

    expect(result.nodes).toEqual([textContainerNode, textContainerNode]);
  });

  it('parse <b> + <a> + text within div as text container', async () => {
    const bold = 'bold';
    const finaltext = 'final';
    const source = 'https://www.wikipedia.org';
    const link = 'link';
    const rawHtml = `<div><b>${bold}</b><a href="${source}">${link}</a>${finaltext}</div>`;
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        type: NodeType.TextContainer,
        path: ['div'],
        children: [
          {
            type: NodeType.Text,
            path: ['div', 'b', 'text'],
            content: bold,
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: true,
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
          {
            type: NodeType.Link,
            path: ['div', 'a'],
            source,
            isWithinTextContainer: true,
            children: [
              {
                content: link,
                type: NodeType.Text,
                path: ['div', 'a', 'text'],
                hasStrikethrough: false,
                isUnderlined: false,
                isItalic: false,
                isBold: false,
                isWithinTextContainer: true,
                isWithinLink: true,
              } as TextNode,
            ],
          } as LinkNode,
          {
            content: finaltext,
            type: NodeType.Text,
            path: ['div', 'text'],
            hasStrikethrough: false,
            isUnderlined: false,
            isItalic: false,
            isBold: false,
            isWithinTextContainer: true,
            isWithinLink: false,
          } as TextNode,
        ],
      },
    ]);
  });
});
