import React from 'react';
import { TextContainerNode, NodeBase } from '@react-native-html/parser';
import { StyleProp, TextProperties, TextStyle } from 'react-native';
import { onLayoutHandler } from './types';

interface Props {
  node: TextContainerNode;
  style?: StyleProp<TextStyle>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  onLayout?: onLayoutHandler;
}

export const HtmlNodeTextContainer = ({
  node,
  TextComponent,
  renderChildNode,
  style,
  onLayout,
}: Props) => {
  return (
    <TextComponent style={style} onLayout={onLayout}>
      {node.children.map((child, index) => renderChildNode(child, index))}
    </TextComponent>
  );
};
