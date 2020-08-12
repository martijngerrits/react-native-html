import React, { SyntheticEvent, useState } from 'react';
import { WebViewProps } from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import { StyleProp, ViewStyle } from 'react-native';

import { onLayoutHandler } from '../types';

type OnShouldStartLoadWithRequest = (event: { url?: string }) => boolean;

interface AutoHeightProps {
  source: WebViewSource;
  WebViewComponent: React.ElementType<WebViewProps>;
  style?: StyleProp<ViewStyle>;
  firstChildInListItemStyle?: StyleProp<ViewStyle>;
  onLayout?: onLayoutHandler;
  width: number;
  // onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest;
}

export const AutoHeightWebView: React.FC<AutoHeightProps> = ({
  source,
  WebViewComponent,
  style,
  firstChildInListItemStyle,
  onLayout,
  width,
  // onShouldStartLoadWithRequest,
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
          width,
        },
        style,
        firstChildInListItemStyle,
      ]}
      injectedJavaScript={script}
      scrollEnabled={false}
      onLayout={onLayout}
      // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
