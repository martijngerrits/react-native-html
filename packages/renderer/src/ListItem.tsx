import React from 'react';
import { ListItemNode } from '@react-native-html/parser';
import { Text, View, StyleSheet } from 'react-native';

interface ListItemProps {
  node: ListItemNode;
  isOrdered: boolean;
  number: number;
  children: React.ReactNode;
}
export const ListItem = ({ isOrdered, number, children }: ListItemProps) => {
  return (
    <View style={styles.listItem}>
      <Text>{isOrdered ? `${number}.` : '\u2022'} </Text>
      <View style={styles.listItemContents}>{children}</View>
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
