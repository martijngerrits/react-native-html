import React, { FunctionComponent, useState } from 'react';
import {
  NodeBase,
  isTextNode,
  isImageNode,
  isLinkNode,
  isIFrameNode,
  isListNode,
  isTextContainerNode,
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
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { HtmlNodeImage } from './nodes/HtmlNodeImage';
import { HtmlNodeText } from './nodes/HtmlNodeText';
import { HtmlNodeLink } from './nodes/HtmlNodeLink';
import { HtmlNodeList } from './nodes/HtmlNodeList';
import { HtmlStyles } from './HtmlStyles';
import { HtmlNodeTextContainer } from './nodes/HtmlNodeTextContainer';

export interface CustomRendererArgs {
  node: NodeBase;
  key: string;
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode;
}

export interface HtmlViewOptions {
  customRenderer?: (args: CustomRendererArgs) => React.ReactNode;
  TextComponent: React.ElementType<TextProperties>;
  ImageComponent: React.ElementType<ImageProperties>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => void;
  htmlStyles: HtmlStyles;
}

export interface HtmlViewProps extends Partial<HtmlViewOptions> {
  nodes: NodeBase[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const HtmlView: FunctionComponent<HtmlViewProps> = ({
  nodes,
  TextComponent = Text,
  ImageComponent = Image,
  TouchableComponent = TouchableOpacity,
  WebViewComponent = WebView,
  htmlStyles = {},
  containerStyle,
}: HtmlViewProps) => {
  const [maxWidth, setMaxWidth] = useState(Dimensions.get('window').width);

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
        { TextComponent, ImageComponent, TouchableComponent, WebViewComponent, htmlStyles },
        maxWidth
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const renderNodes = (nodes: NodeBase[], options: HtmlViewOptions, maxWidth: number) => {
  const renderChildNode = (node: NodeBase, index: number) =>
    renderNode(node, options, index, maxWidth, renderChildNode);
  return nodes.map((node, index) => renderNode(node, options, index, maxWidth, renderChildNode));
};

const renderNode = (
  node: NodeBase,
  options: HtmlViewOptions,
  index: number,
  maxWidth: number,
  renderChildNode: (node: NodeBase, index: number) => React.ReactNode
): React.ReactNode => {
  const {
    customRenderer,
    TextComponent,
    ImageComponent,
    TouchableComponent,
    WebViewComponent,
    htmlStyles,
  } = options;

  const key = `react_native_node_${node.type}_${index}`;
  if (customRenderer) {
    const view = customRenderer({ node, key, renderChildNode });
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
      />
    );
  }
  if (isLinkNode(node)) {
    return (
      <HtmlNodeLink
        key={key}
        node={node}
        style={htmlStyles.touchable}
        TouchableComponent={TouchableComponent}
        renderChildNode={renderChildNode}
      />
    );
  }
  if (isIFrameNode(node)) {
    return <WebViewComponent key={key} source={{ uri: node.source }} style={htmlStyles.iframe} />;
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
      />
    );
  }

  return null;
};
