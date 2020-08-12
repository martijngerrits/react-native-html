import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IFrameNode } from '@react-native-html/parser';
import { WebViewProps } from 'react-native-webview';
// import Url from 'url-parse';

import { onLayoutHandler } from './types';
import { AutoHeightWebView } from './components/AutoHeightWebView';

interface Props {
  node: IFrameNode;
  WebViewComponent: React.ElementType<WebViewProps>;
  style?: StyleProp<ViewStyle>;
  firstChildInListItemStyle?: StyleProp<ViewStyle>;
  onLayout?: onLayoutHandler;
  onLinkPress?: (uri: string) => boolean;
  maxWidth: number;
}

export const HtmlNodeIFrame: React.FC<Props> = ({
  node,
  WebViewComponent,
  style,
  firstChildInListItemStyle,
  onLayout,
  maxWidth,
  // onLinkPress,
}) => {
  const source = { uri: node.source };
  // const onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = ({ url }) => {
  //   if (!url) {
  //     return true;
  //   }

  //   const originalUrl = new Url(node.source);
  //   const targetUrl = new Url(url);

  //   if (
  //     originalUrl.hostname.replace('www.', '') !== targetUrl.hostname.replace('www.', '') ||
  //     originalUrl.pathname !== targetUrl.pathname
  //   ) {
  //     return onPress(url, onLinkPress);
  //   }
  //   return true;
  // };

  if (typeof node.height !== 'undefined') {
    let height = 0;
    let width: number | undefined = 0;
    if (!node.width || node.width <= maxWidth) {
      height = node.height;
      width = node.width;
    } else {
      width = maxWidth;
      height = (maxWidth / node.width) * node.height;
    }
    return (
      <WebViewComponent
        onLayout={onLayout}
        source={source}
        style={[{ height, width }, style, firstChildInListItemStyle]}
        scrollEnabled={false}
        // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    );
  }

  return (
    <AutoHeightWebView
      onLayout={onLayout}
      style={style}
      firstChildInListItemStyle={firstChildInListItemStyle}
      WebViewComponent={WebViewComponent}
      source={source}
      width={node.width && node.width < maxWidth ? node.width : maxWidth}
      // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

// const onPress = (uri: string, customHandler?: (uri: string) => boolean): boolean => {
//   if (customHandler) {
//     return customHandler(uri);
//   }
//   Linking.openURL(uri);
//   return false;
// };
