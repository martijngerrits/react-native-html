import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { RawHtmlView } from '@react-native-html/renderer';

interface Props {
  description?: string;
  rawHtml: string;
}

export const HtmlScreenBase = ({ description, rawHtml }: Props) => {
  return (
    <SafeAreaView>
      {description && <Text>{description}</Text>}
      <RawHtmlView rawHtml={rawHtml} htmlStyles={htmlStyles} />
    </SafeAreaView>
  );
};

/* eslint-disable react-native/no-unused-styles */
const htmlStyles = StyleSheet.create({
  p: {
    margin: 10,
  },
});
/* eslint-enabl react-native/no-unused-styles */
