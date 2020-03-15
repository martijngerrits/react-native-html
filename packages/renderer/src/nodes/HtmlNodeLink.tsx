import React from 'react';
import { LinkNode, NodeBase } from '@react-native-html/parser';
import { StyleProp, ViewStyle, TouchableWithoutFeedbackProps, Linking } from 'react-native';

interface Props {
  node: LinkNode;
  style?: StyleProp<ViewStyle>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
}

export const HtmlNodeLink = ({ node, style, TouchableComponent, renderChildNode }: Props) => {
  return (
    <TouchableComponent style={style} onPress={() => onPress(node.source)}>
      {node.children.map((child, childIndex) => renderChildNode(child, childIndex))}
    </TouchableComponent>
  );
};

const onPress = (uri: string, customHandler?: (uri: string) => void) => {
  if (customHandler) {
    customHandler(uri);
  } else {
    Linking.openURL(uri);
  }
};
