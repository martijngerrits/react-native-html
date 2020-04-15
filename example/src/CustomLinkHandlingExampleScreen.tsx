import React from 'react';
import { Alert } from 'react-native';

import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<h1>Custom Link Handling Example</h1>
<h3>Link:</h3>
<a href="http://www.wikipedia.org">Wikipedia</a>
<h3>Instagram with auto-height:</h3>
<iframe src="https://instagram.com/p/a1wDZKopa2/embed/" frameborder="0"></iframe>
`;

export const CustomLinkHandlingExampleScreen: React.FC = () => {
  return (
    <HtmlScreenBase
      rawHtml={html}
      htmlViewProps={{
        onLinkPress: (uri: string) => {
          Alert.alert(uri);
          return false; // don't do default action of webview
        },
      }}
    />
  );
};
