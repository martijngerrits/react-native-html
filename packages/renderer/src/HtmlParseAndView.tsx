import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleProp, ScrollView } from 'react-native';
import {
  NodeBase,
  parseHtml,
  CustomParser,
  ResultType,
  ParserPerTag,
} from '@react-native-html/parser';

import { HtmlViewOptions, HtmlView } from './HtmlView';

export interface HtmlParseAndViewProps extends Partial<HtmlViewOptions> {
  rawHtml: string;
  customParser?: CustomParser;
  parserPerTag?: ParserPerTag;
  excludeTags?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: ScrollView | null;
  parseFromCssClass?: string;
  treatImageAsBlockElement?: boolean;
}

export const HtmlParseAndView = ({
  rawHtml,
  customParser,
  parserPerTag,
  excludeTags,
  containerStyle,
  scrollRef,
  parseFromCssClass,
  treatImageAsBlockElement,
  ...options
}: HtmlParseAndViewProps) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const applyEffect = async () => {
      const result = await parseHtml(rawHtml, {
        customParser,
        parserPerTag,
        excludeTags: new Set(excludeTags),
        parseFromCssClass,
        treatImageAsBlockElement,
      });
      if (result.type === ResultType.Success) {
        // console.log(result.nodes);
        setNodes(result.nodes);
      } else {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(result.error);
        }
        setNodes([]);
      }
    };
    applyEffect();
  }, [
    rawHtml,
    customParser,
    parserPerTag,
    excludeTags,
    parseFromCssClass,
    treatImageAsBlockElement,
  ]);

  if (!nodes) return null;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <HtmlView nodes={nodes} scrollRef={scrollRef} {...options} containerStyle={containerStyle} />
  );
};
