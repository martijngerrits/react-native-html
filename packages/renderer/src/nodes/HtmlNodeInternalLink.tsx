import React, { RefObject } from 'react';
import { NodeBase, InternalLinkNode } from '@react-native-html/parser';
import { StyleProp, ViewStyle, TouchableWithoutFeedbackProps, TextProperties } from 'react-native';
import { onLayoutHandler, MinimalScrollView } from './types';
import { BasicStyle } from '../HtmlStyles';

interface Props {
  node: InternalLinkNode;
  style?: StyleProp<ViewStyle>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  TextComponent: React.ElementType<TextProperties>;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  offsetYs: Record<string, number>;
  scrollRef?: RefObject<MinimalScrollView | null>;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeInternalLink: React.FC<Props> = ({
  node,
  style,
  TouchableComponent,
  TextComponent,
  renderChildNode,
  scrollRef,
  offsetYs,
  onLayout,
  firstChildInListItemStyle,
}) => {
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
