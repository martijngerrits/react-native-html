// eslint-disable-next-line unicorn/filename-case
import React, { FunctionComponent, useState, useRef, RefObject } from 'react';
import { NodeBase } from '@react-native-html/parser';
import {
  Text,
  ImageProperties,
  TextProperties,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { HtmlStyles } from './HtmlStyles';
import { HtmlNodeListItemNumberProps, HtmlNodeListItemBulletProps } from './nodes/HtmlNodeListItem';
import { onLayoutHandler, MinimalScrollView } from './nodes/types';
import { renderNodes } from './renderNodes';

export interface CustomRendererArgs {
  node: NodeBase;
  key: string;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<ViewStyle>;
}

export interface HtmlViewOptions {
  customRenderer?: (args: CustomRendererArgs) => React.ReactNode;
  TextComponent: React.ElementType<TextProperties>;
  ImageComponent: React.ElementType<ImageProperties>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => void;
  htmlStyles: HtmlStyles;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
}

export interface HtmlViewProps extends Partial<HtmlViewOptions> {
  nodes: NodeBase[];
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: RefObject<MinimalScrollView | null>;
}

export const HtmlView: FunctionComponent<HtmlViewProps> = ({
  nodes,
  customRenderer,
  TextComponent = Text,
  ImageComponent = Image,
  TouchableComponent = TouchableOpacity,
  WebViewComponent = WebView,
  htmlStyles = {},
  OrderedListItemIndicator,
  UnorderedListItemIndicator,
  containerStyle,
  scrollRef,
}: HtmlViewProps) => {
  const [maxWidth, setMaxWidth] = useState(Dimensions.get('window').width);
  const [hasSetMaxWidth, setHasSetMaxWidth] = useState(false);
  const offsetYsRef = useRef<Record<string, number>>({});

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={({
        nativeEvent: {
          layout: { width },
        },
      }) => {
        if (width !== maxWidth) {
          setMaxWidth(width);
        }
        if (!hasSetMaxWidth) {
          setHasSetMaxWidth(true);
        }
      }}
    >
      {hasSetMaxWidth &&
        renderNodes(
          nodes,
          {
            customRenderer,
            TextComponent,
            ImageComponent,
            TouchableComponent,
            WebViewComponent,
            htmlStyles,
            OrderedListItemIndicator,
            UnorderedListItemIndicator,
          },
          maxWidth,
          offsetYsRef.current,
          scrollRef
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
