import React from 'react';
import { TextNode } from '@react-native-html/parser';
import { TextProperties, StyleProp, TextStyle, StyleSheet } from 'react-native';

interface Props {
  node: TextNode;
  TextComponent: React.ElementType<TextProperties>;
  textStyle?: StyleProp<TextStyle>;
  nestedTextStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
}

export const HtmlNodeText = ({
  node,
  TextComponent,
  textStyle,
  nestedTextStyle,
  linkStyle,
}: Props) => {
  const combinedStyles: StyleProp<TextStyle>[] = [];
  if (node.isBold) {
    combinedStyles.push(styles.bold);
  }
  if (node.isItalic) {
    combinedStyles.push(styles.italic);
  }
  if (node.isUnderlined) {
    combinedStyles.push(styles.underline);
  }
  if (node.hasStrikethrough) {
    combinedStyles.push(styles.strike);
  }

  if (node.isWithinTextContainer) {
    combinedStyles.push(nestedTextStyle);
  } else {
    combinedStyles.push(textStyle);
  }

  if (node.isWithinLink) {
    combinedStyles.push(linkStyle);
  }

  return <TextComponent style={combinedStyles}>{node.content}</TextComponent>;
};

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: 'underline',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});
