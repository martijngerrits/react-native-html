import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import {
  NodeBase,
  parseHtml,
  TagHandler,
  ElementParser,
  ResultType,
} from '@react-native-html/parser';

import { HtmlViewOptions, HtmlView } from './HtmlView';

export interface HtmlParseAndViewProps extends Partial<HtmlViewOptions> {
  rawHtml: string;
  customParser?: ElementParser;
  tagHandlers?: TagHandler[];
  excludeTags?: string[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const HtmlParseAndView = ({
  rawHtml,
  customParser,
  tagHandlers,
  excludeTags,
  containerStyle,
  ...options
}: HtmlParseAndViewProps) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const sideEffect = async () => {
      const result = await parseHtml({
        rawHtml,
        customParser,
        tagHandlers,
        excludeTags: new Set(excludeTags),
      });
      if (result.type === ResultType.Success) {
        setNodes(result.nodes);
      }
    };
    sideEffect();
  }, [rawHtml, customParser, tagHandlers, excludeTags]);

  if (!nodes) return null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <HtmlView nodes={nodes} {...options} containerStyle={containerStyle} />;
};
