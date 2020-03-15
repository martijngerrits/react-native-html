import React from 'react';
import { ListItemNode, NodeBase } from '@react-native-html/parser';
import { Text, View, StyleSheet } from 'react-native';
import { HtmlListStyles } from '../HtmlStyles';

interface Props {
  node: ListItemNode;
  isOrdered: boolean;
  number: number;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  styles: HtmlListStyles;
}

export const HtmlNodeListItem = ({
  node,
  isOrdered,
  number,
  renderChildNode,
  styles: providedStyles,
}: Props) => {
  const listItemStyles = [styles.listItem, providedStyles.listItem];
  if (isOrdered) {
    listItemStyles.push(providedStyles.orderedListItem);
  } else {
    listItemStyles.push(providedStyles.unorderedListItem);
  }

  const indicatorStyles = isOrdered ? providedStyles.listItemNumber : providedStyles.listItemBullet;

  const listItemContentStyles = [styles.listItemContents, providedStyles.listItemContent];

  return (
    <View style={listItemStyles}>
      <Text style={indicatorStyles}>{isOrdered ? `${number}.` : '\u2022'} </Text>
      <View style={listItemContentStyles}>
        {node.children.map((child, index) => renderChildNode(child, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
  },
  listItemContents: {
    flexDirection: 'column',
  },
});
