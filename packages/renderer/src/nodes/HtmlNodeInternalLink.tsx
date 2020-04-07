import React, { RefObject } from 'react';
import { NodeBase, InternalLinkNode } from '@react-native-html/parser';
import {
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedbackProps,
  TextProperties,
  ScrollView,
} from 'react-native';
import { onLayoutHandler } from './types';
import { BasicStyle } from '../HtmlStyles';

interface Props {
  node: InternalLinkNode;
  style?: StyleProp<ViewStyle>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  offsetYs: Record<string, number>;
  scrollRef?: RefObject<ScrollView | null>;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeInternalLink = ({
  node,
  style,
  TouchableComponent,
  TextComponent,
  renderChildNode,
  scrollRef,
  offsetYs,
  onLayout,
  firstChildInListItemStyle,
}: Props) => {
  const children = node.children.map((child, childIndex) => renderChildNode(child, childIndex));
  if (!node.hasResolvedTarget) {
    return <>{children}</>;
  }

  const LinkComponent = node.isWithinTextContainer ? TextComponent : TouchableComponent;
  return (
    <LinkComponent
      style={[style, firstChildInListItemStyle]}
      onPress={() => {
        if (scrollRef?.current && typeof offsetYs[node.targetKey] === 'number') {
          scrollRef.current.scrollTo({ y: offsetYs[node.targetKey], animated: true });
        }
      }}
      onLayout={onLayout}
    >
      {children}
    </LinkComponent>
  );
};
