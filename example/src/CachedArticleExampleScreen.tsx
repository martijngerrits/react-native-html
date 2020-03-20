import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { HtmlParseAndViewProps, HtmlStyles, HtmlView } from '@react-native-html/renderer';
import { parseHtml, NodeBase, ResultType } from '@react-native-html/parser';
import { articleHtml } from './ArticleExampleScreen';

interface Props {
  description?: string;
  rawHtml: string;
  htmlViewProps?: Omit<HtmlParseAndViewProps, 'rawHtml'>;
}

let parsedNodes: NodeBase[] = [];
const init = async () => {
  const result = await parseHtml({ rawHtml: articleHtml });
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

const htmlStyles: HtmlStyles = {
  text: {
    marginVertical: 5,
  },
  image: {
    marginVertical: 5,
  },
  list: {
    marginVertical: 5,
  },
  h1: {
    fontSize: 28,
    marginTop: 15,
  },
  h2: {
    fontSize: 24,
    marginTop: 15,
  },
  h3: {
    fontSize: 20,
    marginTop: 10,
  },
  listItem: {
    marginVertical: 2,
  },
};
