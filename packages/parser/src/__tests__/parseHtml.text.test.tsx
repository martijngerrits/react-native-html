import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode } from '../nodes';

describe('parseHtml - text tests', () => {
  it('parse text', async () => {
    const rawHtml = 'hallo dit is een test';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: rawHtml,
        type: NodeType.Text,
        path: ['text'],
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
      } as TextNode,
    ]);
  });
  it('parse text within h1 with header number', async () => {
    const rawHtml = '<h1>hallo dit is een test</h2>';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        path: ['h1', 'text'],
        header: 1,
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
      } as TextNode,
    ]);
  });
  it('parse text within b with isBold flag', async () => {
    const rawHtml = '<b>hallo dit is een test</b>';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        path: ['b', 'text'],
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: true,
      } as TextNode,
    ]);
  });
  it('parse text within i with isItalic flag', async () => {
    const rawHtml = '<i>hallo dit is een test</i>';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        path: ['i', 'text'],
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: true,
        isBold: false,
      } as TextNode,
    ]);
  });
  it('parse text within u with isUnderlined flag', async () => {
    const rawHtml = '<u>hallo dit is een test</u>';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        path: ['u', 'text'],
        hasStrikethrough: false,
        isUnderlined: true,
        isItalic: false,
        isBold: false,
      } as TextNode,
    ]);
  });
  it('parse text within del with hasStrikethrough flag', async () => {
    const rawHtml = '<del>hallo dit is een test</del>';
    const result = (await parseHtml({ rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        path: ['del', 'text'],
        hasStrikethrough: true,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
      } as TextNode,
    ]);
  });
});
