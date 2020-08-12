import React from 'react';
import { TableNode } from '@react-native-html/parser';
import { StyleSheet, StyleProp } from 'react-native';
import { WebViewProps } from 'react-native-webview';

import {
  BasicStyle,
  HtmlTableStyles,
  HtmlTableCellStyles,
  HtmlTableStylesEvenOdd,
} from '../HtmlStyles';
import { onLayoutHandler } from './types';
import { AutoHeightWebView } from './components/AutoHeightWebView';

interface Props {
  node: TableNode;
  styles: HtmlTableStyles;
  WebViewComponent: React.ElementType<WebViewProps>;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
  maxWidth: number;
}

enum HtmlTableElements {
  HtmlTableElementTh = 'th',
  HtmlTableElementTr = 'tr',
  HtmlTableElementTd = 'td',
  HtmlTableElementEven = 'even',
  HtmlTableElementOdd = 'odd',
}

export const HtmlNodeTable: React.FC<Props> = ({
  node,
  styles: providedStyles,
  WebViewComponent,
  onLayout,
  firstChildInListItemStyle,
  maxWidth,
}) => {
  const tableStyles = `
  ${Object.keys(providedStyles).map((element): string => stylePropsToCss({
    element: element as HtmlTableElements,
    styleProps: providedStyles[element as keyof HtmlTableStyles],
  })).join('')}`;

  return (
    <AutoHeightWebView
      style={styles.webview}
      onLayout={onLayout}
      firstChildInListItemStyle={firstChildInListItemStyle}
      WebViewComponent={WebViewComponent}
      source={{
        html: `
          <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
                <style>
                  body {
                      padding: 0;
                      margin: 0;
                  }
                  table {
                      border-collapse: collapse;
                  }
                  ${tableStyles}
                </style>
            </head>
            <body>
              <div style="overflow-x: auto;">
                  ${node.source}
              </div>
            </body>
          </html>
        `,
      }}
      width={maxWidth}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

interface StylePropsToCssProps {
  element: HtmlTableElements;
  styleProps: HtmlTableStyles[keyof HtmlTableStyles];
}

const stylePropsToCss = ({ element, styleProps }: StylePropsToCssProps): string => {
  if (!element || !styleProps) return '';

  let selector = '';
  let cssStyle = '';

  switch (element) {
    case HtmlTableElements.HtmlTableElementTh:
      selector = 'table th, table thead';
      cssStyle = parseTableCelStyleProps(styleProps as HtmlTableCellStyles)
      break;
    case HtmlTableElements.HtmlTableElementTr:
      selector = 'table tr';
      cssStyle = parseTableCelStyleProps(styleProps as HtmlTableCellStyles)
      break;
    case HtmlTableElements.HtmlTableElementTd:
      selector = 'table td';
      cssStyle = parseTableCelStyleProps(styleProps as HtmlTableCellStyles)
      break;
    case HtmlTableElements.HtmlTableElementEven:
      selector = 'table tr:nth-child(even)';
      cssStyle = parseTableCelStyleProps(styleProps as HtmlTableStylesEvenOdd);
      break;
    case HtmlTableElements.HtmlTableElementOdd:
      selector = 'table tr:nth-child(odd)';
      cssStyle = parseTableCelStyleProps(styleProps as HtmlTableStylesEvenOdd);
      break;
    default:
      break;
  }

  if (!selector || !cssStyle) return '';

  return `
    ${selector} {
      ${cssStyle}
    }
  `;
};

const parseTableCelStyleProps = (style: HtmlTableCellStyles): string => {
  let css = '';

  // Default padding
  let padding = '';
  if (style.padding) {
    padding = typeof style.padding === 'number'
      ? `padding: ${style.padding}px;\n`
      : `padding: ${style.padding};\n`;
  }

  // React-Native specific padding settings
  if (style.paddingVertical && style.paddingHorizontal) {
    padding = `padding: ${style.paddingVertical} ${style.paddingHorizontal};\n`;
  } else if (style.paddingVertical && !style.paddingHorizontal) {
    padding = `padding: ${style.paddingVertical} 0px;\n`;
  } else if (style.paddingHorizontal && !style.paddingVertical) {
    padding = `padding: 0px ${style.paddingHorizontal};\n`;
  }

  if (padding) {
    css += padding;
  }
  if (style.backgroundColor) {
    css += `background-color: ${style.backgroundColor};\n`;
  }
  if (style.color) {
    css += `color: ${style.color};\n`;
  }
  if (style.fontSize) {
    css += `font-size: ${style.fontSize};\n`;
  }
  if (style.fontWeight) {
    css += `font-weight: ${style.fontWeight};\n`;
  }
  if (style.textAlign) {
    css += `text-align: ${style.textAlign};\n`;
  }

  return css;
}
