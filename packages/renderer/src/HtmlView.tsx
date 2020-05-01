// eslint-disable-next-line unicorn/filename-case
import React, { useState, useRef, RefObject } from 'react';
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
  additionalArgs?: Record<string, unknown>;
}

export interface HtmlViewOptions {
  customRenderer?: (args: CustomRendererArgs) => React.ReactNode;
  customRendererAdditionalArgs?: RefObject<Record<string, unknown>>;
  TextComponent: React.ElementType<TextProperties>;
  ImageComponent: React.ElementType<ImageProperties>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => boolean;
  htmlStyles: HtmlStyles;
  OrderedListItemIndicator?: React.ComponentType<HtmlNodeListItemNumberProps>;
  UnorderedListItemIndicator?: React.ComponentType<HtmlNodeListItemBulletProps>;
}

export interface HtmlViewProps extends Partial<HtmlViewOptions> {
  nodes: NodeBase[];
  containerStyle?: StyleProp<ViewStyle>;
  scrollRef?: RefObject<MinimalScrollView | null>;
}

export const HtmlView: React.FC<HtmlViewProps> = React.memo(
  ({
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
    onLinkPress,
    customRendererAdditionalArgs,
  }) => {
    const [maxWidth, setMaxWidth] = useState(Dimensions.get('window').width);
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
        }}
      >
        {renderNodes(
          nodes,
          {
            customRenderer,
            customRendererAdditionalArgs: customRendererAdditionalArgs ?? undefined,
            TextComponent,
            ImageComponent,
            TouchableComponent,
            WebViewComponent,
            htmlStyles,
            OrderedListItemIndicator,
            UnorderedListItemIndicator,
            onLinkPress,
          },
          maxWidth,
          offsetYsRef.current,
          scrollRef
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {},
});
