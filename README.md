# react-native-html

## install
`yarn add @react-native-html/parser @react-native-html/renderer`

## basic example (typescript)
```
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { HtmlParseAndView, HtmlParseAndViewProps, HtmlStyles } from '@react-native-html/renderer';

const rawHtml = `<p>Hello, how are you?</p>`


export const Example = ({ rawHtml, htmlViewProps, children }: Props) => {
  const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <SafeAreaView>
      {children}
      <ScrollView
        ref={instance => {
          setHasScrollViewRef(true);
          scrollRef.current = instance;
        }}
      >
        {hasScrollViewRef && (
          <HtmlParseAndView
            rawHtml={rawHtml}
            htmlStyles={htmlStyles}
            containerStyle={styles.container}
            scrollRef={scrollRef.current}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...htmlViewProps}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const htmlStyles: HtmlStyles = {
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
  },
  paragraph: {
    marginVertical: 10,
  },
  image: {
    marginVertical: 0,
  },
  list: {
    marginVertical: 5,
  },
  h1: {
    fontSize: 30,
    lineHeight: 30 * 1.4,
    marginTop: 10,
    fontWeight: '500',
  },
  h2: {
    fontSize: 26,
    lineHeight: 26 * 1.4,
    marginTop: 10,
    fontWeight: '500',
  },
  h3: {
    fontSize: 24,
    lineHeight: 24 * 1.4,
    marginTop: 10,
    fontWeight: '500',
  },
  listItem: {
    marginVertical: 2,
  },
  listItemContent: {},
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
});
```


## more examples
See example app for more examples

## why?
Other packages exist but:
- minimizing the number of views needed to display the html (not every dom element is a view)
- more control on what gets wrapped inside a <Text /> component
- parsing white spaces as per html specs
- separated parsing and rendering of html enables to cache parsing and/or move parsing to backend (e.g., node-parser)
- support for inline links within html
