import React from 'react';
import { TextNode } from '@react-native-html/parser';
import { TextProperties, StyleProp, TextStyle, StyleSheet } from 'react-native';
import { HtmlHeaderStyles } from '../HtmlStyles';

interface Props {
  node: TextNode;
  TextComponent: React.ElementType<TextProperties>;
  textStyle?: StyleProp<TextStyle>;
  nestedTextStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
  headerStyles: HtmlHeaderStyles;
}

export const HtmlNodeText = ({
  node,
  TextComponent,
  textStyle,
  nestedTextStyle,
  linkStyle,
  headerStyles,
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

  if (node.isWithinTextContainer || node.isWithinList) {
    if (nestedTextStyle) {
      combinedStyles.push(nestedTextStyle);
    }
  } else if (textStyle) {
    combinedStyles.push(textStyle);
  }

  if (node.isWithinLink) {
    combinedStyles.push(styles.link);
    if (linkStyle) {
      combinedStyles.push(linkStyle);
    }
  }

  if (node.header) {
    const headerStyle = `h${node.header}` as keyof HtmlHeaderStyles;
    if (headerStyles[headerStyle]) {
      combinedStyles.push(headerStyles[headerStyle]);
    }
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
  link: {
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
});
