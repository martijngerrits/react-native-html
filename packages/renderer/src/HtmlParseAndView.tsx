import React, { useEffect, useState, RefObject } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import {
  NodeBase,
  parseHtml,
  CustomParser,
  ResultType,
  ParserPerTag,
} from '@react-native-html/parser';

import { HtmlViewOptions, HtmlView } from './HtmlView';
import { MinimalScrollView } from './nodes/types';

export interface HtmlParseAndViewProps extends Partial<HtmlViewOptions> {
  rawHtml: string;
  customParser?: CustomParser;
  parserPerTag?: ParserPerTag;
  excludeTags?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: RefObject<MinimalScrollView | null>;
  parseFromCssClass?: string;
  treatImageAsBlockElement?: boolean;
}

export const HtmlParseAndView: React.FC<HtmlParseAndViewProps> = ({
  rawHtml,
  customParser,
  parserPerTag,
  excludeTags,
  containerStyle,
  scrollRef,
  parseFromCssClass,
  treatImageAsBlockElement,
  ...options
}) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  useEffect(() => {
    const applyEffect = async (): Promise<void> => {
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
