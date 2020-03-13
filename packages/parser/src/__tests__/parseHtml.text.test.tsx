import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType } from '../nodes';

describe('parseHtml - text tests', () => {
  it('parse text', async () => {
    const html = 'hallo dit is een test';
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: html,
        type: NodeType.Text,
        path: ['text'],
        style: {},
      },
    ]);
  });
  it('parse text within p', async () => {
    const text = 'hallo dit is een test';
    const html = `<p>${text}</p>`;
    const result = (await parseHtml(html)) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        path: ['p', 'text'],
        style: {},
      },
    ]);
  });
  it('parse text with styling for P', async () => {
    const text = 'hallo dit is een test';
    const html = `<P>${text}</P>`;
    const result = (await parseHtml(html, {
      P: {
        fontSize: 10,
      },
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        path: ['p', 'text'],
        style: {
          fontSize: 10,
        },
      },
    ]);
  });
  it('inherits styles with direct ancestor having precedence', async () => {
    const text = 'hallo dit is een test';
    const html = `<div><P>${text}</P></div><div>${text}</div>`;
    const result = (await parseHtml(html, {
      div: {
        fontSize: 5,
        marginTop: 10,
      },
      P: {
        fontSize: 10,
      },
    })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);
    expect(result.nodes).toEqual([
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'p', 'text'],
        style: {
          fontSize: 10,
          marginTop: 10,
        },
      },
      {
        content: text,
        type: NodeType.Text,
        path: ['div', 'text'],
        style: {
          fontSize: 5,
          marginTop: 10,
        },
      },
    ]);
  });
});
