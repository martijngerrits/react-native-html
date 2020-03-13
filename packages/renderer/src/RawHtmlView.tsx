import React, { useEffect, useState } from 'react';
import { NodeBase, parseHtml } from '@react-native-html/parser';
import { ResultType } from '@react-native-html/parser/dist/parseHtml';

import { HtmlViewOptions, HtmlView } from './HtmlView';

interface Props {
  rawHtml: string;
  options?: HtmlViewOptions;
}

export const RawHtmlView = ({ rawHtml, options }: Props) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const sideEffect = async () => {
      const result = await parseHtml(rawHtml);
      if (result.type === ResultType.Success) {
        setNodes(result.nodes);
      }
    };
    sideEffect();
  }, [rawHtml]);

  if (!nodes) return null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <HtmlView nodes={nodes} {...options} />;
};
