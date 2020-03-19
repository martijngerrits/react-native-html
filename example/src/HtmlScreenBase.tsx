import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { HtmlParseAndView, HtmlParseAndViewProps, HtmlStyles } from '@react-native-html/renderer';

interface Props {
  description?: string;
  rawHtml: string;
  htmlViewProps?: Omit<HtmlParseAndViewProps, 'rawHtml'>;
}

export const HtmlScreenBase = ({ description, rawHtml, htmlViewProps }: Props) => {
  return (
    <SafeAreaView>
      {description && <Text>{description}</Text>}
      <HtmlParseAndView
        rawHtml={rawHtml}
        htmlStyles={htmlStyles}
        containerStyle={styles.container}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...htmlViewProps}
      />
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
