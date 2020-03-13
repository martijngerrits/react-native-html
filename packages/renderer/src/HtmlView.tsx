import React, { FunctionComponent } from 'react';
import {
  NodeBase,
  isTextNode,
  isImageNode,
  isLinkNode,
  isIFrameNode,
  isListNode,
  ListItemNode,
} from '@react-native-html/parser';
import {
  Text,
  ImageProperties,
  StyleProp,
  ImageStyle,
  TextProperties,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  Linking,
  View,
  StyleSheet,
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';

export interface HtmlViewOptions {
  customRenderer?: (node: NodeBase, key: string) => React.ReactNode;
  TextComponent: React.ElementType<TextProperties>;
  ImageComponent: React.ElementType<ImageProperties>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => void;
}

export interface HtmlViewProps {
  customRenderer?: (node: NodeBase, key: string) => React.ReactNode;
  TextComponent?: React.ElementType<TextProperties>;
  ImageComponent?: React.ElementType<ImageProperties>;
  TouchableComponent?: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent?: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => void;
  nodes: NodeBase[];
}

export const HtmlView: FunctionComponent<HtmlViewProps> = ({
  nodes,
  TextComponent = Text,
  ImageComponent = Image,
  TouchableComponent = TouchableOpacity,
  WebViewComponent = WebView,
}: HtmlViewProps) => {
  return (
    <>
      {nodes.map((node, index) =>
        renderNode(
          node,
          { TextComponent, ImageComponent, TouchableComponent, WebViewComponent },
          index
        )
      )}
    </>
  );
};

const renderNode = (node: NodeBase, options: HtmlViewOptions, index: number): React.ReactNode => {
  const {
    customRenderer,
    TextComponent,
    ImageComponent,
    TouchableComponent,
    WebViewComponent,
  } = options;

  const key = `react_native_node_${node.type}_${index}`;
  if (customRenderer) {
    const view = customRenderer(node, key);
    if (view) {
      return view;
    }
  }
  if (isTextNode(node)) {
    return (
      <TextComponent key={key} style={node.style}>
        {node.content}
      </TextComponent>
    );
  }
  if (isImageNode(node)) {
    return (
      <ImageComponent
        key={key}
        source={{ uri: node.source }}
        style={[node.style, { width: node.width, height: node.height }] as StyleProp<ImageStyle>}
      />
    );
  }
  if (isLinkNode(node)) {
    if (node.hasTextSibling && node.hasOnlyTextChildren) {
      // use text
      return (
        <TextComponent key={key} style={node.style} onPress={() => onPress(node.source)}>
          {node.children.map((child, childIndex) => renderNode(child, options, childIndex))}
        </TextComponent>
      );
    }
    return (
      <TouchableComponent key={key} style={node.style} onPress={() => onPress(node.source)}>
        {node.children.map((child, childIndex) => renderNode(child, options, childIndex))}
      </TouchableComponent>
    );
  }
  if (isIFrameNode(node)) {
    return <WebViewComponent key={key} source={{ uri: node.source }} style={node.style} />;
  }
  if (isListNode(node) && node.children.length > 0) {
    return node.children.map((child, childIndex) => (
      <ListItem
        key={
          `react_native_list_item_node_${childIndex}` /* eslint-disable-line react/no-array-index-key */
        }
        node={child}
        number={index + 1}
        isOrdered={node.isOrdered}
        options={options}
      />
    ));
  }

  return null;
};

interface ListItemProps {
  node: ListItemNode;
  isOrdered: boolean;
  number: number;
  options: HtmlViewOptions;
}
const ListItem = ({ node, isOrdered, number, options }: ListItemProps) => {
  return (
    <View style={styles.listItem}>
      <Text>{isOrdered ? number : '\u2022'} </Text>
      <View style={styles.listItemContents}>
        {node.children.map((child, childIndex) => renderNode(child, options, childIndex))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
  },
  listItemContents: {
    flexDirection: 'column',
  },
});

const onPress = (uri: string, customHandler?: (uri: string) => void) => {
  if (customHandler) {
    customHandler(uri);
  } else {
    Linking.openURL(uri);
  }
};
