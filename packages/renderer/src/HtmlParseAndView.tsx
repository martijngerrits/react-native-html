import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp, ScrollView } from 'react-native';
import {
  NodeBase,
  parseHtml,
  TagHandler,
  CustomParser,
  ResultType,
} from '@react-native-html/parser';

import { HtmlViewOptions, HtmlView } from './HtmlView';

export interface HtmlParseAndViewProps extends Partial<HtmlViewOptions> {
  rawHtml: string;
  customParser?: CustomParser;
  tagHandlers?: TagHandler[];
  excludeTags?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: ScrollView | null;
  parseFromCssClass?: string;
}

export const HtmlParseAndView = ({
  rawHtml,
  customParser,
  tagHandlers,
  excludeTags,
  containerStyle,
  scrollRef,
  parseFromCssClass,
  ...options
}: HtmlParseAndViewProps) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const applyEffect = async () => {
      const result = await parseHtml(rawHtml, {
        customParser,
        tagHandlers,
        excludeTags: new Set(excludeTags),
        parseFromCssClass,
      });
      if (result.type === ResultType.Success) {
        // console.log(result.nodes);
        setNodes(result.nodes);
      }
    };
    applyEffect();
  }, [rawHtml, customParser, tagHandlers, excludeTags, parseFromCssClass]);

  if (!nodes) return null;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <HtmlView nodes={nodes} scrollRef={scrollRef} {...options} containerStyle={containerStyle} />
  );
};
