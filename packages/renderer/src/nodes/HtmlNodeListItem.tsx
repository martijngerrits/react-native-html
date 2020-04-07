import React from 'react';
import { ListItemNode, NodeBase } from '@react-native-html/parser';
import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { HtmlListStyles, BasicStyle } from '../HtmlStyles';
import { onLayoutHandler } from './types';

interface Props {
  node: ListItemNode;
  isOrdered: boolean;
  number: number;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  styles: HtmlListStyles;
  textStyle: StyleProp<TextStyle>;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeListItem = ({
  node,
  isOrdered,
  number,
  renderChildNode,
  styles: providedStyles,
  OrderedListItemIndicator: orderedListItemIndicator,
  UnorderedListItemIndicator: unorderedListItemIndicator,
  onLayout,
  firstChildInListItemStyle,
  textStyle,
}: Props) => {
  const listItemStyles = [styles.listItem, providedStyles.listItem];
  if (isOrdered && providedStyles.orderedListItem) {
    listItemStyles.push(providedStyles.orderedListItem);
  } else if (!isOrdered && providedStyles.unorderedListItem) {
    listItemStyles.push(providedStyles.unorderedListItem);
  }
  if (firstChildInListItemStyle) {
    listItemStyles.push(firstChildInListItemStyle);
  }

  const indicatorStyles: StyleProp<TextStyle> = [];
  if (isOrdered && providedStyles.listItemNumber) {
    indicatorStyles.push(providedStyles.listItemNumber);
  } else if (!isOrdered && providedStyles.listItemBullet) {
    indicatorStyles.push(providedStyles.listItemBullet);
  }

  const listItemContentStyles = [styles.listItemContents, providedStyles.listItemContent];

  const NumberIndicator = orderedListItemIndicator ?? HtmlNodeListItemNumber;
  const BulletIndicator = unorderedListItemIndicator ?? HtmlNodeListItemBullet;

  return (
    <View style={listItemStyles} onLayout={onLayout} collapsable={!onLayout}>
      {isOrdered ? (
        <NumberIndicator
          number={number}
          style={providedStyles.listItemNumber}
          textStyle={textStyle}
        />
      ) : (
        <BulletIndicator style={providedStyles.listItemBullet} textStyle={textStyle} />
      )}
      <View style={listItemContentStyles}>
        {node.children.map((child, index) => renderChildNode(child, index))}
      </View>
    </View>
  );
};

export interface HtmlNodeListItemNumberProps {
  number: number;
  style?: StyleProp<TextStyle>;
  textStyle: StyleProp<TextStyle>;
}

const HtmlNodeListItemNumber = ({ number, textStyle, style }: HtmlNodeListItemNumberProps) => {
  return <Text style={[textStyle, style]}>{number}. </Text>;
};

export interface HtmlNodeListItemBulletProps {
  style?: StyleProp<TextStyle>;
  textStyle: StyleProp<TextStyle>;
}
const HtmlNodeListItemBullet = ({ textStyle, style }: HtmlNodeListItemBulletProps) => {
  return <Text style={[textStyle, style]}>{'\u2022'} </Text>;
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
  },
  listItemContents: {
    flexDirection: 'column',
    flexShrink: 1,
    overflow: 'hidden',
  },
});
