import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { RawHtmlView } from '@react-native-html/renderer';

interface Props {
  description?: string;
  rawHtml: string;
}

export const HtmlScreenBase = ({ description, rawHtml }: Props) => {
  return (
    <SafeAreaView>
      {description && <Text>{description}</Text>}
      <RawHtmlView rawHtml={rawHtml} />
    </SafeAreaView>
  );
};
