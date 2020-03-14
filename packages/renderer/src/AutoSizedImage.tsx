import React, { useState, useEffect } from 'react';
import { Image, ImageProperties, Dimensions, ImageStyle, StyleProp } from 'react-native';

interface Props {
  uri: string;
  ImageComponent: React.ElementType<ImageProperties>;
  style: ImageStyle;
  width?: number;
  height?: number;
}

export const AutoSizedImage = ({
  uri,
  ImageComponent,
  style,
  width: providedWidth,
  height: providedHeight,
}: Props) => {
  const [size, setSize] = useState({
    width: providedWidth ?? 1,
    height: providedHeight ?? 1,
  });
  useEffect(() => {
    Image.getSize(
      uri,
      (w, h) => {
        const windowWidth = Dimensions.get('window').width;
        let width = w;
        let height = h;
        if (w > windowWidth) {
          const ratio = windowWidth / w;
          width = windowWidth;
          height = h * ratio;
        }
        setSize({ width, height });
      },
      () => {}
    );
  }, [uri]);

  return (
    <ImageComponent
      source={{ uri }}
      style={[style, { width: size.width, height: size.height }] as StyleProp<ImageStyle>}
    />
  );
};
