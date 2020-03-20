import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { HtmlParseAndView, HtmlParseAndViewProps } from '@react-native-html/renderer';
import { htmlStyles } from './htmlStyles';

interface Props {
  rawHtml: string;
  htmlViewProps?: Omit<HtmlParseAndViewProps, 'rawHtml'>;
  children?: React.ReactNode;
}

export const HtmlScreenBase = ({ rawHtml, htmlViewProps, children }: Props) => {
  const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <SafeAreaView>
      {children}
      <ScrollView
        ref={instance => {
          setHasScrollViewRef(true);
          scrollRef.current = instance;
        }}
      >
        {hasScrollViewRef && (
          <HtmlParseAndView
            rawHtml={rawHtml}
            htmlStyles={htmlStyles}
            containerStyle={styles.container}
            scrollRef={scrollRef.current}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...htmlViewProps}
          />
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
