import React, { useEffect, useState } from 'react';
import { ViewStyle, ImageStyle, TextStyle, StyleProp } from 'react-native';
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
  excludeTags?: string[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const RawHtmlView = ({
  rawHtml,
  options,
  htmlStyles,
  customElementParser,
  tagHandlers,
  excludeTags,
  containerStyle,
}: Props) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const sideEffect = async () => {
      const result = await parseHtml({
        rawHtml,
        customElementParser,
        tagHandlers,
        excludeTags: new Set(excludeTags),
      });
      if (result.type === ResultType.Success) {
        setNodes(result.nodes);
      }
    };
    sideEffect();
  }, [rawHtml, htmlStyles, customElementParser, tagHandlers, excludeTags]);

  if (!nodes) return null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <HtmlView nodes={nodes} {...options} containerStyle={containerStyle} />;
};
