import React, { RefObject } from 'react';
import { StyleProp } from 'react-native';
import {
  NodeBase,
  isTextNode,
  isTextContainerNode,
  isImageNode,
  isLinkNode,
  isInternalLinkNode,
  isIFrameNode,
  isListNode,
  isTableNode,
} from '@react-native-html/parser';
import type { HtmlViewOptions } from './HtmlView';
import { onLayoutHandler, MinimalScrollView } from './nodes/types';
import { BasicStyle } from './HtmlStyles';
import { HtmlNodeTextContainer } from './nodes/HtmlNodeTextContainer';
import { HtmlNodeImage } from './nodes/HtmlNodeImage';
import { HtmlNodeLink } from './nodes/HtmlNodeLink';
import { HtmlNodeList } from './nodes/HtmlNodeList';
import { HtmlNodeInternalLink } from './nodes/HtmlNodeInternalLink';
import { HtmlNodeText } from './nodes/HtmlNodeText';
import { HtmlNodeIFrame } from './nodes/HtmlNodeIFrame';
import { HtmlNodeTable } from './nodes/HtmlNodeTable';

export const renderNodes = (
  nodes: NodeBase[],
  options: HtmlViewOptions,
  maxWidth: number,
  offsetYs: Record<string, number>,
  scrollRef?: RefObject<MinimalScrollView | null>
): React.ReactNode => {
  const renderChildNode = (node: NodeBase): React.ReactNode =>
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
  scrollRef?: RefObject<MinimalScrollView | null>
): React.ReactNode => {
  const {
    customRenderer,
    customRendererAdditionalArgs,
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

  const firstChildInListItemStyle: StyleProp<BasicStyle> = node.isFirstChildInListItem
    ? htmlStyles.firstChildInListItem ?? { marginTop: 0, paddingTop: 0 } // default style
    : undefined;

  if (customRenderer) {
    const view = customRenderer({
      node,
      key,
      renderChildNode,
      onLayout,
      firstChildInListItemStyle,
      additionalArgs: customRendererAdditionalArgs?.current ?? {},
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
        paragraphStyle={htmlStyles.paragraph}
        paragraphAfterHeaderStyle={htmlStyles.paragraphAfterHeader}
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
        textStyle={htmlStyles.text}
        paragraphStyle={htmlStyles.paragraph}
        paragraphAfterHeaderStyle={htmlStyles.paragraphAfterHeader}
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
        onLinkPress={options.onLinkPress}
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
      <HtmlNodeIFrame
        onLayout={onLayout}
        key={key}
        node={node}
        style={htmlStyles.iframe}
        firstChildInListItemStyle={firstChildInListItemStyle}
        WebViewComponent={WebViewComponent}
        onLinkPress={options.onLinkPress}
        maxWidth={maxWidth}
      />
    );
  }
  if (isListNode(node) && node.children.length > 0) {
    return (
      <HtmlNodeList
        key={key}
        node={node}
        renderChildNode={renderChildNode}
        textStyle={htmlStyles.text}
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
  if (isTableNode(node)) {
    return (
      <HtmlNodeTable
        key={key}
        onLayout={onLayout}
        node={node}
        styles={{ ...htmlStyles.table }}
        firstChildInListItemStyle={firstChildInListItemStyle}
        WebViewComponent={WebViewComponent}
        maxWidth={maxWidth}
      />
    )
  }

  return null;
};
