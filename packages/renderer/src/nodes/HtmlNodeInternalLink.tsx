import React from 'react';
import { NodeBase, InternalLinkNode } from '@react-native-html/parser';
import {
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedbackProps,
  TextProperties,
  ScrollView,
} from 'react-native';
import { onLayoutHandler } from './types';

interface Props {
  node: InternalLinkNode;
  style?: StyleProp<ViewStyle>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  scrollToY?: number;
  scrollRef?: ScrollView;
  onLayout?: onLayoutHandler;
}

export const HtmlNodeInternalLink = ({
  node,
  style,
  TouchableComponent,
  TextComponent,
  renderChildNode,
  scrollRef,
  scrollToY,
  onLayout,
}: Props) => {
  const children = node.children.map((child, childIndex) => renderChildNode(child, childIndex));
  if (!node.hasResolvedTarget) {
    return <>{children}</>;
  }

  const LinkComponent = node.isWithinTextContainer ? TextComponent : TouchableComponent;
  return (
    <LinkComponent
      style={style}
      onPress={() => {
        if (scrollRef && typeof scrollToY === 'number') {
          scrollRef.scrollTo({ y: scrollToY, animated: true });
        }
      }}
      onLayout={onLayout}
    >
      {children}
    </LinkComponent>
  );
};
