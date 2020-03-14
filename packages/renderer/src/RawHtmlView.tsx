import React, { useEffect, useState } from 'react';
import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import {
  NodeBase,
  parseHtml,
  TagHandler,
  ElementParser,
  ResultType,
} from '@react-native-html/parser';

import { HtmlViewOptions, HtmlView } from './HtmlView';

interface Props {
  rawHtml: string;
  options?: HtmlViewOptions;
  htmlStyles?: Record<string, ViewStyle | TextStyle | ImageStyle>;
  customElementParser?: ElementParser;
  tagHandlers?: TagHandler[];
}

export const RawHtmlView = ({
  rawHtml,
  options,
  htmlStyles,
  customElementParser,
  tagHandlers,
}: Props) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const sideEffect = async () => {
      const result = await parseHtml(rawHtml, htmlStyles, customElementParser, tagHandlers);
      if (result.type === ResultType.Success) {
        setNodes(result.nodes);
      }
    };
    sideEffect();
  }, [rawHtml, htmlStyles, customElementParser, tagHandlers]);

  if (!nodes) return null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <HtmlView nodes={nodes} {...options} />;
};
