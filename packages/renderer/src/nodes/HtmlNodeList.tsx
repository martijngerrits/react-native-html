import React from 'react';
import { View } from 'react-native';
import { ListNode, NodeBase } from '@react-native-html/parser';
import { HtmlNodeListItem } from './HtmlNodeListItem';
import { HtmlListStyles } from '../HtmlStyles';

interface Props {
  node: ListNode;
  styles: HtmlListStyles;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
}

export const HtmlNodeList = ({ node, renderChildNode, styles }: Props) => {
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
        />
      ))}
    </View>
  );
};
