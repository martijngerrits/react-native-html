import React from 'react';
import { TextContainerNode, NodeBase, isTextNode } from '@react-native-html/parser';
import { StyleProp, TextProperties, TextStyle } from 'react-native';
import { onLayoutHandler } from './types';
import { BasicStyle } from '../HtmlStyles';

interface Props {
  node: TextContainerNode;
  textStyle: StyleProp<TextStyle>;
  paragraphStyle: StyleProp<TextStyle>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeTextContainer = ({
  node,
  TextComponent,
  renderChildNode,
  textStyle,
  paragraphStyle,
  onLayout,
  firstChildInListItemStyle,
}: Props) => {
  return (
    <TextComponent
      style={[textStyle, paragraphStyle, firstChildInListItemStyle]}
      onLayout={onLayout}
    >
      {node.children.map((child, index) =>
        isTextNode(child) && child.canBeTextContainerBase
          ? child.content
          : renderChildNode(child, index)
      )}
    </TextComponent>
  );
};
