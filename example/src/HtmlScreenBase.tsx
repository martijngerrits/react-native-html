import React, { useRef, MutableRefObject } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  HtmlParseAndView,
  HtmlParseAndViewProps,
  MinimalScrollView,
} from '@react-native-html/renderer';
import { ScrollView } from 'react-native-gesture-handler';

import { htmlStyles } from './htmlStyles';

interface Props {
  rawHtml: string;
  htmlViewProps?: Omit<HtmlParseAndViewProps, 'rawHtml'>;
  children?: React.ReactNode;
}

export const HtmlScreenBase: React.FC<Props> = ({ rawHtml, htmlViewProps, children }) => {
  // const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <SafeAreaView>
      {children}
      <ScrollView ref={scrollRef}>
        <HtmlParseAndView
          rawHtml={rawHtml}
          htmlStyles={htmlStyles}
          containerStyle={styles.container}
          scrollRef={(scrollRef as unknown) as MutableRefObject<MinimalScrollView | null>}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...htmlViewProps}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
});
