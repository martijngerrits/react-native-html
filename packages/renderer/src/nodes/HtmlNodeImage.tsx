import React, { useState, useEffect } from 'react';
import { Image, ImageProperties, ImageStyle, StyleProp } from 'react-native';
import { ImageNode } from '@react-native-html/parser';
import { onLayoutHandler } from './types';
import { BasicStyle } from '../HtmlStyles';

interface Props {
  node: ImageNode;
  ImageComponent: React.ElementType<ImageProperties>;
  style?: StyleProp<ImageStyle>;
  maxWidth: number;
  onLayout?: onLayoutHandler;
  firstChildInListItemStyle?: StyleProp<BasicStyle>;
}

export const HtmlNodeImage = ({
  node,
  ImageComponent,
  style,
  maxWidth,
  onLayout,
  firstChildInListItemStyle,
}: Props) => {
  const { source: uri, width, height } = node;

  const [scalableWidth, setScalableWidth] = useState<number | null>(null);
  const [scalableHeight, setScalableHeight] = useState<number | null>(null);

  useEffect(() => {
    Image.getSize(
      uri,
      (w, h) => adjustSize(w, h, width, height, setScalableWidth, setScalableHeight, maxWidth),
      err => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  if (!scalableHeight || !scalableWidth || !uri) return null;

  return (
    <ImageComponent
      source={{ uri }}
      style={[
        {
          width: scalableWidth,
          height: scalableHeight,
        },
        style,
        firstChildInListItemStyle,
      ]}
      onLayout={onLayout}
    />
  );
};

const adjustSize = (
  sourceWidth: number,
  sourceHeight: number,
  width: number | undefined,
  height: number | undefined,
  setScalableWidth: (val: number) => void,
  setScalableHeight: (val: number) => void,
  maxWidth: number
) => {
  let ratio = 1;

  if (width && height) {
    ratio = Math.min(width / sourceWidth, height / sourceHeight);
  } else if (width) {
    ratio = width / sourceWidth;
  } else if (height) {
    ratio = height / sourceHeight;
  }

  let computedWidth = sourceWidth * ratio;
  let computedHeight = sourceHeight * ratio;
  if (computedWidth > maxWidth) {
    const aspectRatio = sourceWidth / sourceHeight;
    computedHeight = maxWidth / aspectRatio;
    computedWidth = maxWidth;
  }

  setScalableWidth(computedWidth);
  setScalableHeight(computedHeight);
};
