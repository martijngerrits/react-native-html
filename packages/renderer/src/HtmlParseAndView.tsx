import React, { useEffect, useState, RefObject, useRef } from 'react';
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

interface ParseInputProps {
  rawHtml: string;
  customParser?: CustomParser;
  parserPerTag?: ParserPerTag;
  excludeTags?: string[];
  parseFromCssClass?: string;
  treatImageAsBlockElement?: boolean;
  customParserAdditionalArgs?: RefObject<Record<string, unknown>>;
}

export interface HtmlParseAndViewProps extends Partial<HtmlViewOptions>, ParseInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: RefObject<MinimalScrollView | null>;
  onLoad?: () => void;
  parseWhen?: (args: ParseInputProps) => boolean;
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
  customParserAdditionalArgs,
  onLoad,
  parseWhen,
  ...options
}) => {
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  const previousHtmlRef = useRef('');

  useEffect(() => {
    const canIParseChecker =
      typeof parseWhen !== 'undefined' ? parseWhen : () => rawHtml !== previousHtmlRef.current;
    if (
      canIParseChecker({
        rawHtml,
        customParser,
        parserPerTag,
        excludeTags,
        parseFromCssClass,
        treatImageAsBlockElement,
        customParserAdditionalArgs,
      })
    ) {
      previousHtmlRef.current = rawHtml;
      const applyEffect = async (): Promise<void> => {
        const result = await parseHtml(rawHtml, {
          customParser,
          parserPerTag,
          excludeTags: new Set(excludeTags),
          parseFromCssClass,
          treatImageAsBlockElement,
          customParserAdditionalArgs: customParserAdditionalArgs?.current ?? undefined,
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
        if (onLoad) {
          onLoad();
        }
      };
      applyEffect();
    }
  }, [
    rawHtml,
    customParser,
    parserPerTag,
    excludeTags,
    parseFromCssClass,
    treatImageAsBlockElement,
    customParserAdditionalArgs,
    parseWhen,
    onLoad,
  ]);

  if (!nodes) return null;

  return (
    <HtmlView
      nodes={nodes}
      scrollRef={scrollRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...options}
      containerStyle={containerStyle}
    />
  );
};
