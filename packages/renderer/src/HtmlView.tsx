import React, { FunctionComponent, useState, useRef } from 'react';
import {
  NodeBase,
  isTextNode,
  isImageNode,
  isLinkNode,
  isIFrameNode,
  isListNode,
  isTextContainerNode,
  isInternalLinkNode,
} from '@react-native-html/parser';
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
  ScrollView,
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { HtmlNodeImage } from './nodes/HtmlNodeImage';
import { HtmlNodeText } from './nodes/HtmlNodeText';
import { HtmlNodeLink } from './nodes/HtmlNodeLink';
import { HtmlNodeList } from './nodes/HtmlNodeList';
import { HtmlStyles, BasicStyle } from './HtmlStyles';
import { HtmlNodeTextContainer } from './nodes/HtmlNodeTextContainer';
import { HtmlNodeListItemNumberProps, HtmlNodeListItemBulletProps } from './nodes/HtmlNodeListItem';
import { onLayoutHandler } from './nodes/types';
import { HtmlNodeInternalLink } from './nodes/HtmlNodeInternalLink';

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
  scrollRef?: ScrollView | null;
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

const renderNodes = (
  nodes: NodeBase[],
  options: HtmlViewOptions,
  maxWidth: number,
  offsetYs: Record<string, number>,
  scrollRef?: ScrollView | null
) => {
  const renderChildNode = (node: NodeBase) =>
    renderNode(node, options, maxWidth, renderChildNode, offsetYs, scrollRef);
  return nodes.map(node =>
    renderNode(node, options, maxWidth, renderChildNode, offsetYs, scrollRef)
  );
};

const renderNode = (
  node: NodeBase,
  options: HtmlViewOptions,
  maxWidth: number,
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode,
  offsetYs: Record<string, number>,
  scrollRef?: ScrollView | null
): React.ReactNode => {
  const {
    customRenderer,
    TextComponent,
    ImageComponent,
    TouchableComponent,
    WebViewComponent,
    htmlStyles,
    OrderedListItemIndicator,
    UnorderedListItemIndicator,
  } = options;
  const { key } = node;
  const onLayout: onLayoutHandler | undefined =
    node.isLinkedTo && scrollRef
      ? ({ nativeEvent: { layout } }) => {
          // eslint-disable-next-line no-param-reassign
          offsetYs[node.key] = layout.y;
        }
      : undefined;

  const firstChildInListItemStyle: StyleProp<BasicStyle> =
    htmlStyles.firstChildInListItem && node.isFirstChildInListItem
      ? htmlStyles.firstChildInListItem
      : { marginTop: 0 }; // default style

  if (customRenderer) {
    const view = customRenderer({
      node,
      key,
      renderChildNode,
      onLayout,
      firstChildInListItemStyle,
    });
    if (view) {
      return view;
    }
  }

  if (isTextNode(node)) {
    return (
      <HtmlNodeText
        key={key}
        node={node}
        textStyle={htmlStyles.text}
        nestedTextStyle={htmlStyles.nestedText}
        linkStyle={htmlStyles.link}
        TextComponent={TextComponent}
        headerStyles={{
          h1: htmlStyles.h1,
          h2: htmlStyles.h2,
          h3: htmlStyles.h3,
          h4: htmlStyles.h4,
          h5: htmlStyles.h5,
          h6: htmlStyles.h6,
        }}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }
  if (isTextContainerNode(node)) {
    return (
      <HtmlNodeTextContainer
        key={key}
        node={node}
        style={htmlStyles.text}
        TextComponent={TextComponent}
        renderChildNode={renderChildNode}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }
  if (isImageNode(node)) {
    return (
      <HtmlNodeImage
        key={key}
        node={node}
        style={htmlStyles.image}
        ImageComponent={ImageComponent}
        maxWidth={maxWidth}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }
  if (isLinkNode(node)) {
    return (
      <HtmlNodeLink
        key={key}
        node={node}
        style={htmlStyles.touchable}
        TextComponent={TextComponent}
        TouchableComponent={TouchableComponent}
        renderChildNode={renderChildNode}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }
  if (isInternalLinkNode(node)) {
    return (
      <HtmlNodeInternalLink
        key={key}
        node={node}
        TouchableComponent={TouchableComponent}
        TextComponent={TextComponent}
        scrollRef={scrollRef}
        offsetYs={offsetYs}
        renderChildNode={renderChildNode}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }
  if (isIFrameNode(node)) {
    return (
      <WebViewComponent
        onLayout={onLayout}
        key={key}
        source={{ uri: node.source }}
        style={[htmlStyles.iframe, firstChildInListItemStyle]}
      />
    );
  }
  if (isListNode(node) && node.children.length > 0) {
    return (
      <HtmlNodeList
        key={key}
        node={node}
        renderChildNode={renderChildNode}
        styles={{
          list: htmlStyles.list,
          orderedList: htmlStyles.orderedList,
          unorderedList: htmlStyles.unorderedList,
          listItem: htmlStyles.listItem,
          orderedListItem: htmlStyles.orderedListItem,
          unorderedListItem: htmlStyles.unorderedListItem,
          listItemBullet: htmlStyles.listItemBullet,
          listItemNumber: htmlStyles.listItemNumber,
          listItemContent: htmlStyles.listItemContent,
        }}
        OrderedListItemIndicator={OrderedListItemIndicator}
        UnorderedListItemIndicator={UnorderedListItemIndicator}
        onLayout={onLayout}
        firstChildInListItemStyle={firstChildInListItemStyle}
      />
    );
  }

  return null;
};
