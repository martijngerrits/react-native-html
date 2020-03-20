import React from 'react';
import { ListItemNode, NodeBase } from '@react-native-html/parser';
import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { HtmlListStyles } from '../HtmlStyles';
import { onLayoutHandler } from './types';

interface Props {
  node: ListItemNode;
  isOrdered: boolean;
  number: number;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  styles: HtmlListStyles;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
  onLayout?: onLayoutHandler;
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
}: Props) => {
  const listItemStyles = [styles.listItem, providedStyles.listItem];
  if (isOrdered && providedStyles.orderedListItem) {
    listItemStyles.push(providedStyles.orderedListItem);
  } else if (!isOrdered && providedStyles.unorderedListItem) {
    listItemStyles.push(providedStyles.unorderedListItem);
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
    <View style={listItemStyles} onLayout={onLayout}>
      {isOrdered ? (
        <NumberIndicator number={number} style={providedStyles.listItemNumber} />
      ) : (
        <BulletIndicator style={providedStyles.listItemBullet} />
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
}

const HtmlNodeListItemNumber = ({ number, style }: HtmlNodeListItemNumberProps) => {
  return <Text style={style}>{number}. </Text>;
};

export interface HtmlNodeListItemBulletProps {
  style?: StyleProp<TextStyle>;
}
const HtmlNodeListItemBullet = ({ style }: HtmlNodeListItemBulletProps) => {
  return <Text style={style}>{'\u2022'} </Text>;
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
  },
  listItemContents: {
    flexDirection: 'column',
  },
});
