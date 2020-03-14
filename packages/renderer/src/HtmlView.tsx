import React, { FunctionComponent } from 'react';
import {
  NodeBase,
  isTextNode,
  isImageNode,
  isLinkNode,
  isIFrameNode,
  isListNode,
} from '@react-native-html/parser';
import {
  Text,
  ImageProperties,
  TextProperties,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
  Linking,
  ImageStyle,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { ListItem } from './ListItem';
import { AutoSizedImage } from './AutoSizedImage';

export interface HtmlStyles {
  text?: StyleProp<TextStyle>;
  h1?: StyleProp<TextStyle>;
  h2?: StyleProp<TextStyle>;
  h3?: StyleProp<TextStyle>;
  h4?: StyleProp<TextStyle>;
  h5?: StyleProp<TextStyle>;
  h6?: StyleProp<TextStyle>;
  paragraph?: StyleProp<TextStyle>;
  image?: StyleProp<ImageStyle>;
  inlineImage?: StyleProp<ImageStyle>;
  standAloneImage?: StyleProp<ImageStyle>;
  link?: StyleProp<TextStyle>;
  inlineLink?: StyleProp<TextStyle>;
  standAloneLink?: StyleProp<TextStyle>;
  list?: StyleProp<ViewStyle>;
  orderedList?: StyleProp<ViewStyle>;
  unorderedList?: StyleProp<ViewStyle>;
  listItem?: StyleProp<ViewStyle>;
  orderedListItem?: StyleProp<ViewStyle>;
  unorderedListItem?: StyleProp<ViewStyle>;
  listItemBullet?: StyleProp<TextStyle>;
  listItemNumber?: StyleProp<TextStyle>;
  listItemContent?: StyleProp<ViewStyle>;
}

export interface HtmlViewOptions {
  customRenderer?: (node: NodeBase, key: string) => React.ReactNode;
  TextComponent: React.ElementType<TextProperties>;
  ImageComponent: React.ElementType<ImageProperties>;
  TouchableComponent: React.ElementType<TouchableWithoutFeedbackProps>;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLinkPress?: (uri: string) => void;
  htmlStyles: HtmlStyles;
}

export interface HtmlViewProps extends Partial<HtmlViewOptions> {
  nodes: NodeBase[];
}

export const HtmlView: FunctionComponent<HtmlViewProps> = ({
  nodes,
  TextComponent = Text,
  ImageComponent = Image,
  TouchableComponent = TouchableOpacity,
  WebViewComponent = WebView,
  htmlStyles = {},
}: HtmlViewProps) => {
  return (
    <>
      {nodes.map((node, index) =>
        renderNode(
          node,
          { TextComponent, ImageComponent, TouchableComponent, WebViewComponent, htmlStyles },
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
    htmlStyles,
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
      <TextComponent key={key} style={htmlStyles.text}>
        {node.content}
      </TextComponent>
    );
  }
  if (isImageNode(node)) {
    return (
      <AutoSizedImage
        key={key}
        uri={node.source}
        width={node.width}
        height={node.height}
        style={node.style as ImageStyle}
        ImageComponent={ImageComponent}
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
    return node.children.map((listItem, listItemIndex) => (
      <ListItem
        key={
          `react_native_list_item_node_${listItemIndex}` /* eslint-disable-line react/no-array-index-key */
        }
        node={listItem}
        number={listItemIndex + 1}
        isOrdered={node.isOrdered}
      >
        {listItem.children.map((listItemChildren, listItemChildrenIndex) =>
          renderNode(listItemChildren, options, listItemChildrenIndex)
        )}
      </ListItem>
    ));
  }

  return null;
};

const onPress = (uri: string, customHandler?: (uri: string) => void) => {
  if (customHandler) {
    customHandler(uri);
  } else {
    Linking.openURL(uri);
  }
};
