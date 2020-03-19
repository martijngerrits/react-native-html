import React from 'react';
import { View } from 'react-native';
import { ListNode, NodeBase } from '@react-native-html/parser';
import {
  HtmlNodeListItem,
  HtmlNodeListItemBulletProps,
  HtmlNodeListItemNumberProps,
} from './HtmlNodeListItem';
import { HtmlListStyles } from '../HtmlStyles';

interface Props {
  node: ListNode;
  styles: HtmlListStyles;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
}

export const HtmlNodeList = ({
  node,
  renderChildNode,
  styles,
  OrderedListItemIndicator,
  UnorderedListItemIndicator,
}: Props) => {
  const listStyles = [styles.list];
  if (node.isOrdered) {
    listStyles.push(styles.orderedList);
  } else {
    listStyles.push(styles.unorderedList);
  }
  return (
    <View style={listStyles}>
      {node.children.map((listItemNode, listItemIndex) => (
        <HtmlNodeListItem
          key={
            `html_list_item_node_${listItemIndex}` /* eslint-disable-line react/no-array-index-key */
          }
          node={listItemNode}
          renderChildNode={renderChildNode}
          isOrdered={node.isOrdered}
          number={listItemIndex + 1}
          styles={styles}
          OrderedListItemIndicator={OrderedListItemIndicator}
          UnorderedListItemIndicator={UnorderedListItemIndicator}
        />
      ))}
    </View>
  );
};
