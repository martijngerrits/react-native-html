import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { HtmlParseAndViewProps, HtmlView } from '@react-native-html/renderer';
import { parseHtml, NodeBase, ResultType } from '@react-native-html/parser';
import { articleHtml } from './ArticleExampleScreen';
import { htmlStyles } from './htmlStyles';

interface Props {
  description?: string;
  rawHtml: string;
  htmlViewProps?: Omit<HtmlParseAndViewProps, 'rawHtml'>;
}

let parsedNodes: NodeBase[] = [];
const init = async () => {
  const result = await parseHtml(articleHtml);
  if (result.type === ResultType.Success) {
    parsedNodes = result.nodes;
  }
};
init();

export const CachedArticleExampleScreen = () => {
  const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={instance => {
          setHasScrollViewRef(true);
          scrollRef.current = instance;
        }}
      >
        {hasScrollViewRef && (
          <HtmlView nodes={parsedNodes} htmlStyles={htmlStyles} scrollRef={scrollRef.current} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
});
