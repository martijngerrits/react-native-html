import React, { useState, useEffect, useRef } from 'react';
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
  const previousUriRef = useRef('');

  const [scaledSize, setScaledSize] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });

  useEffect(() => {
    let cancel: CancelPromise;
    if (previousUriRef.current !== uri) {
      const sideEffect = async (): Promise<void> => {
        try {
          const operation = getImageSize(uri);
          cancel = operation.cancel;

          const { width: w, height: h } = await operation.size;
          const nextSize = getScaledSize(w, h, width, height, maxWidth);
          setScaledSize(nextSize);
        } catch (error) {
          if (__DEV__ && error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        }
      };
      sideEffect();
      previousUriRef.current = uri;
    } else if (
      typeof scaledSize.width === 'number' &&
      typeof scaledSize.height === 'number' &&
      maxWidth < scaledSize.width
    ) {
      setScaledSize(getSizeIfExceedingMaxWidth(scaledSize.width, scaledSize.height, maxWidth));
    }

    return () => {
      if (cancel) {
        cancel();
      }
    };
  }, [uri, height, maxWidth, width, scaledSize]);

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

export type CancelPromise = ((reason?: Error) => void) | undefined;
const getImageSize = (
  uri: string
): { size: Promise<{ width: number; height: number }>; cancel: CancelPromise } => {
  let cancel: CancelPromise;
  const size = new Promise<{ width: number; height: number }>((resolve, reject) => {
    cancel = reject;
    Image.getSize(
      uri,
      (width, height) => {
        cancel = undefined;
        resolve({ width, height });
      },
      error => {
        reject(error);
      }
    );
  });

  return { size, cancel };
};

const getSizeIfExceedingMaxWidth = (
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number
): { width: number; height: number } => {
  const aspectRatio = sourceWidth / sourceHeight;
  return { height: maxWidth / aspectRatio, width: maxWidth };
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
    const { width: boundedWidth, height: boundedHeight } = getSizeIfExceedingMaxWidth(
      sourceWidth,
      sourceHeight,
      maxWidth
    );
    computedWidth = boundedWidth;
    computedHeight = boundedHeight;
  }

  return {
    width: computedWidth,
    height: computedHeight,
  };
};
