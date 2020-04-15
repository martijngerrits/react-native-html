import React from 'react';
import { LinkNode, NodeBase } from '@react-native-html/parser';
import {
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedbackProps,
  Linking,
  TextProperties,
} from 'react-native';
import { onLayoutHandler } from './types';
import { BasicStyle } from '../HtmlStyles';

interface Props {
  node: LinkNode;
  style?: StyleProp<ViewStyle>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
  onLinkPress?: (uri: string) => void;
}

export const HtmlNodeLink: React.FC<Props> = ({
  node,
  style,
  TouchableComponent,
  TextComponent,
  renderChildNode,
  onLayout,
  firstChildInListItemStyle,
  onLinkPress,
}) => {
  const LinkComponent = node.isWithinTextContainer ? TextComponent : TouchableComponent;
  return (
    <LinkComponent
      style={[style, firstChildInListItemStyle]}
      onPress={() => onPress(node.source, onLinkPress)}
      onLayout={onLayout}
    >
      {node.children.map((child, childIndex) => renderChildNode(child, childIndex))}
    </LinkComponent>
  );
};

const onPress = (uri: string, customHandler?: (uri: string) => void): void => {
  if (customHandler) {
    customHandler(uri);
  } else {
    Linking.openURL(uri);
  }
};
