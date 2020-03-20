import React, { useState, useEffect } from 'react';
import { Image, ImageProperties, ImageStyle, StyleProp } from 'react-native';
import { ImageNode } from '@react-native-html/parser';
import { onLayoutHandler } from './types';

interface Props {
  node: ImageNode;
  ImageComponent: React.ElementType<ImageProperties>;
  style?: StyleProp<ImageStyle>;
  maxWidth: number;
  onLayout?: onLayoutHandler;
}

export const HtmlNodeImage = ({ node, ImageComponent, style, maxWidth, onLayout }: Props) => {
  const { source, width: providedWidth, height: providedHeight } = node;
  const [size, setSize] = useState({
    width: providedWidth ?? 1,
    height: providedHeight ?? 1,
  });
  const [imageSize, setImageSize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    Image.getSize(
      source,
      (width, height) => {
        setImageSize({ width, height });
      },
      () => {}
    );
  }, [source]);

  useEffect(() => {
    const width = providedWidth && providedWidth > 1 ? providedWidth : imageSize.width;
    const height = providedHeight && providedHeight > 1 ? providedHeight : imageSize.height;

    if (width > maxWidth) {
      const ratio = imageSize.width / maxWidth;
      setSize({ width: maxWidth, height: imageSize.height * ratio });
    } else if (width > 1 && height > 1) {
      setSize({ width, height });
    } else {
      const ratio = imageSize.width / width;
      setSize({ width, height: width * ratio });
    }
  }, [maxWidth, imageSize, providedWidth, providedHeight]);

  return (
    <ImageComponent
      source={{ uri: source }}
      style={[{ width: size.width, height: size.height }, style]}
      onLayout={onLayout}
    />
  );
};
