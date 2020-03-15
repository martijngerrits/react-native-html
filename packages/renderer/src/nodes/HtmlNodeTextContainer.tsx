import React from 'react';
import { TextContainerNode, NodeBase } from '@react-native-html/parser';
import { StyleProp, TextProperties, TextStyle } from 'react-native';

interface Props {
  node: TextContainerNode;
  style?: StyleProp<TextStyle>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
}

export const HtmlNodeTextContainer = ({ node, TextComponent, renderChildNode, style }: Props) => {
  return (
    <TextComponent style={style}>
      {node.children.map((child, index) => renderChildNode(child, index))}
    </TextComponent>
  );
};
