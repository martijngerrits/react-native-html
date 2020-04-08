import React from 'react';
import { View, StyleProp, TextStyle } from 'react-native';
import { ListNode, NodeBase } from '@react-native-html/parser';
import {
  HtmlNodeListItem,
  HtmlNodeListItemBulletProps,
  HtmlNodeListItemNumberProps,
} from './HtmlNodeListItem';
import { HtmlListStyles, BasicStyle } from '../HtmlStyles';
import { onLayoutHandler } from './types';

interface Props {
  node: ListNode;
  styles: HtmlListStyles;
  textStyle: StyleProp<TextStyle>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeList: React.FC<Props> = ({
  node,
  renderChildNode,
  styles,
  OrderedListItemIndicator,
  UnorderedListItemIndicator,
  onLayout,
  firstChildInListItemStyle,
  textStyle,
}) => {
  const listStyles = [styles.list];
  if (node.isOrdered) {
    listStyles.push(styles.orderedList);
  } else {
    listStyles.push(styles.unorderedList);
  }
  if (firstChildInListItemStyle) {
    listStyles.push(firstChildInListItemStyle);
  }
  return (
    <View style={listStyles} onLayout={onLayout} collapsable={!onLayout}>
      {node.children.map((listItemNode, listItemIndex) => (
        <HtmlNodeListItem
          key={
            `html_list_item_node_${listItemIndex}` /* eslint-disable-line react/no-array-index-key */
          }
          node={listItemNode}
          renderChildNode={renderChildNode}
          isOrdered={node.isOrdered}
          number={listItemIndex + 1}
          textStyle={textStyle}
          styles={styles}
          OrderedListItemIndicator={OrderedListItemIndicator}
          UnorderedListItemIndicator={UnorderedListItemIndicator}
        />
      ))}
    </View>
  );
};
