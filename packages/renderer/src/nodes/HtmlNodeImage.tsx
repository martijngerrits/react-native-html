import React, { useState, useEffect } from 'react';
import { Image, ImageProperties, ImageStyle, StyleProp } from 'react-native';
import { ImageNode } from '@react-native-html/parser';

interface Props {
  node: ImageNode;
  ImageComponent: React.ElementType<ImageProperties>;
  style?: StyleProp<ImageStyle>;
  maxWidth: number;
}

export const HtmlNodeImage = ({ node, ImageComponent, style, maxWidth }: Props) => {
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
    if (imageSize.width > maxWidth) {
      const ratio = imageSize.width / maxWidth;
      setSize({ width: maxWidth, height: imageSize.height * ratio });
    } else {
      setSize(imageSize);
    }
  }, [maxWidth, imageSize]);

  return (
    <ImageComponent
      source={{ uri: source }}
      style={[{ width: size.width, height: size.height }, style]}
    />
  );
};
