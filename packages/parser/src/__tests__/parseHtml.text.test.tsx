import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, TextNode, getNodeKey } from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

describe('parseHtml - text tests', () => {
  it('parse text', async () => {
    const rawHtml = 'hallo dit is een test';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within h1 with header number', async () => {
    const rawHtml = '<h1>hallo dit is een test</h2>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within b with isBold flag', async () => {
    const rawHtml = '<b>hallo dit is een test</b>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within i with isItalic flag', async () => {
    const rawHtml = '<i>hallo dit is een test</i>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within u with isUnderlined flag', async () => {
    const rawHtml = '<u>hallo dit is een test</u>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within del with hasStrikethrough flag', async () => {
    const rawHtml = '<del>hallo dit is een test</del>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text and replace space by new line and remove duplicate spaces + remove leading spaces', async () => {
    const rawHtml = `<p>  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

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
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text within h1 and within strong with header number', async () => {
    const rawHtml = '<h2><strong>Foliumzuur</strong></h2>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'Foliumzuur',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        header: 2,
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: true,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
    ]);
  });
  it('parse text with isAfterHeader', async () => {
    const rawHtml = '<h2><strong>Foliumzuur</strong></h2><p>alinea 1</p>';
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: 'Foliumzuur',
        type: NodeType.Text,
        key: getNodeKey({ index: 0 }),
        header: 2,
        hasStrikethrough: false,
        isUnderlined: false,
        isItalic: false,
        isBold: true,
        isWithinTextContainer: false,
        isWithinLink: false,
        isWithinList: false,
        canBeTextContainerBase: false,
        isAfterHeader: false,
      } as TextNode,
      {
        content: 'alinea 1',
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
        isAfterHeader: true,
      } as TextNode,
    ]);
  });
});
