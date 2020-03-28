import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlArgs } from './defaultHtmlParseArgs';

describe('parseHtml - text tests', () => {
  it('parse text', async () => {
    const rawHtml = 'hallo dit is een test';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: rawHtml,
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text within h1 with header number', async () => {
    const rawHtml = '<h1>hallo dit is een test</h2>';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        header: 1,
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text within b with isBold flag', async () => {
    const rawHtml = '<b>hallo dit is een test</b>';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: true,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text within i with isItalic flag', async () => {
    const rawHtml = '<i>hallo dit is een test</i>';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: true,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text within u with isUnderlined flag', async () => {
    const rawHtml = '<u>hallo dit is een test</u>';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: true,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text within del with hasStrikethrough flag', async () => {
    const rawHtml = '<del>hallo dit is een test</del>';
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'hallo dit is een test',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: true,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
  it('parse text and replace space by new line and remove duplicate spaces + remove leading spaces', async () => {
    const rawHtml = `<p>  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;
    const result = (await parseHtml({ ...getDefaultParseHtmlArgs(), rawHtml })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: false,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
      } as TextNode,
    ]);
  });
});
