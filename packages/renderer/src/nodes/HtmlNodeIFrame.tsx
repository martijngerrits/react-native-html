import React, { useState, SyntheticEvent } from 'react';
import { StyleProp, ViewStyle, Linking } from 'react-native';
import { IFrameNode } from '@react-native-html/parser';
import { WebViewProps } from 'react-native-webview';
import Url from 'url-parse';

import { onLayoutHandler } from './types';

interface Props {
  node: IFrameNode;
  WebViewComponent: React.ElementType<WebViewProps>;
  style?: StyleProp<ViewStyle>;
  firstChildInListItemStyle?: StyleProp<ViewStyle>;
  onLayout?: onLayoutHandler;
  onLinkPress?: (uri: string) => boolean;
}

type OnShouldStartLoadWithRequest = (event: { url?: string }) => boolean;

export const HtmlNodeIFrame: React.FC<Props> = ({
  node,
  WebViewComponent,
  style,
  firstChildInListItemStyle,
  onLayout,
  onLinkPress,
}) => {
  const hasHeight = typeof node.height !== 'undefined';

  const source = { uri: node.source };
  const onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = ({ url }) => {
    if (!url) {
      return true;
    }

    const originalUrl = new Url(node.source);
    const targetUrl = new Url(url);

    if (
      originalUrl.hostname.replace('www.', '') !== targetUrl.hostname.replace('www.', '') ||
      originalUrl.pathname !== targetUrl.pathname
    ) {
      return onPress(url, onLinkPress);
    }
    return true;
  };

  return hasHeight ? (
    <WebViewComponent
      onLayout={onLayout}
      source={source}
      style={[{ height: node.height, width: node.width }, style, firstChildInListItemStyle]}
      scrollEnabled={false}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  ) : (
    <AutoHeightWebView
      onLayout={onLayout}
      style={style}
      firstChildInListItemStyle={firstChildInListItemStyle}
      WebViewComponent={WebViewComponent}
      source={source}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

interface AutoHeightProps {
  source: { uri: string };
  WebViewComponent: React.ElementType<WebViewProps>;
  style?: StyleProp<ViewStyle>;
  firstChildInListItemStyle?: StyleProp<ViewStyle>;
  onLayout?: onLayoutHandler;
  onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest;
}

const AutoHeightWebView: React.FC<AutoHeightProps> = ({
  source,
  WebViewComponent,
  style,
  firstChildInListItemStyle,
  onLayout,
  onShouldStartLoadWithRequest,
}) => {
  const [height, setHeight] = useState(0);

  return (
    <WebViewComponent
      source={source}
      onMessage={({ nativeEvent: { data } }: SyntheticEvent<unknown, { data?: string }>) => {
        if (!data) {
          return;
        }
        // Sometimes the message is invalid JSON, so we ignore that case
        try {
          const nextHeight = Number.parseInt(data, 10);
          setHeight(nextHeight);
        } catch (error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        }
      }}
      style={[
        {
          height,
        },
        style,
        firstChildInListItemStyle,
      ]}
      injectedJavaScript={script}
      scrollEnabled={false}
      onLayout={onLayout}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
    />
  );
};

// Based on https://github.com/dpnolte/react-native-autoheight-webview/blob/master/autoHeightWebView/utils.js
const script = `

var wrapper;
function updateSize() {
    if (!document.getElementById("rnahw-wrapper")) {
      wrapper = document.createElement('div');
      wrapper.id = 'rnahw-wrapper';
      while (document.body.firstChild instanceof Node) {
        wrapper.appendChild(document.body.firstChild);
      }
      document.body.appendChild(wrapper);
    }
    var height = wrapper.offsetHeight || document.documentElement.offsetHeight;
    window.ReactNativeWebView.postMessage(height.toString());
}
updateSize();
window.addEventListener('load', updateSize);
window.addEventListener('resize', updateSize);

var MutationObserver =
window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(updateSize);
observer.observe(document, {
  subtree: true,
  attributes: true
});

true; 
`;

const onPress = (uri: string, customHandler?: (uri: string) => boolean): boolean => {
  if (customHandler) {
    return customHandler(uri);
  }
  Linking.openURL(uri);
  return false;
};
