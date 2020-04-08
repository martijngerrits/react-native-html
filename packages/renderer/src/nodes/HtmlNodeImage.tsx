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

export const HtmlNodeImage: React.FC<Props> = ({
  node,
  ImageComponent,
  style,
  maxWidth,
  onLayout,
  firstChildInListItemStyle,
}) => {
  const { source: uri, width, height } = node;

  const [scaledSize, setScaledSize] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });

  useEffect(() => {
    Image.getSize(
      uri,
      (w, h) => {
        const nextSize = getScaledSize(w, h, width, height, maxWidth);
        setScaledSize(nextSize);
      },
      error => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(error);
        }
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  if (!scaledSize.height || !scaledSize.width || !uri) return null;

  return (
    <ImageComponent
      source={{ uri }}
      style={[
        {
          width: scaledSize.width,
          height: scaledSize.height,
        },
        style,
        firstChildInListItemStyle,
      ]}
      onLayout={onLayout}
    />
  );
};

const getScaledSize = (
  sourceWidth: number,
  sourceHeight: number,
  width: number | undefined,
  height: number | undefined,
  maxWidth: number
): { width: number; height: number } => {
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

  return {
    width: computedWidth,
    height: computedHeight,
  };
};
