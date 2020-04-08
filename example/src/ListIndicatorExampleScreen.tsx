import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { HtmlNodeListItemNumberProps } from '@react-native-html/renderer';

import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<h1>Custom List Indicators</h1>
<ul><li>test 123</li><li>test 456</li></ul>
<ol><li>woep woep</li><li>yeah </li></ol>
<ul><li>dubbel 1:<ul><li>a</li><li>b</li></ul></li><li>test 456</li></ul>
`;

export const ListIndicatorExampleScreen: React.FC = () => {
  return (
    <HtmlScreenBase
      rawHtml={html}
      htmlViewProps={{
        UnorderedListItemIndicator: ListItemBullet,
        OrderedListItemIndicator: ListItemNumber,
      }}
    />
  );
};

const ListItemBullet: React.FC = () => {
  return (
    <View>
      <View style={styles.listItemBulletContainer}>
        <Text style={styles.listItemBulletLabel}>{'\u2022'} </Text>
      </View>
    </View>
  );
};
const ListItemNumber: React.FC<HtmlNodeListItemNumberProps> = ({ number }) => {
  return (
    <View>
      <View style={styles.listItemNumberContainer}>
        <Text style={styles.listItemNumbrLabel}>{number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemBulletContainer: {
    backgroundColor: '#6ccab5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    flex: 0,
    marginRight: 5,
  },
  listItemBulletLabel: {
    color: '#fff',
    textAlign: 'center',
  },
  listItemNumberContainer: {
    backgroundColor: 'blue',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    flex: 0,
    marginRight: 5,
  },
  listItemNumbrLabel: {
    color: '#fff',
    textAlign: 'center',
  },
});
