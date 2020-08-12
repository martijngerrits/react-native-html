import { parseHtml, ResultType, SuccessResult } from '../parseHtml';
import { NodeType, getNodeKey, TableNode } from '../types/nodes';
import { getDefaultParseHtmlOptions } from './defaultHtmlParseOptions';

describe('parseHtml - table tests', () => {
  it('parse table', async () => {
    const rawHtml = `
      <table>
        <tr><th>Head 1</th><th>Head 2</th></tr>
        <tr><td>Value 1</td><td>Value 2</td></tr>
      </table>
    `;
    const result = (await parseHtml(rawHtml, { ...getDefaultParseHtmlOptions() })) as SuccessResult;

    expect(result.type).toBe(ResultType.Success);

    // We expect the full raw html back without whitespace
    expect(result.nodes).toEqual([
      {
        type: NodeType.Table,
        key: getNodeKey({ index: 0 }),
        source: rawHtml.trim(),
      } as TableNode,
    ]);
  });
});
