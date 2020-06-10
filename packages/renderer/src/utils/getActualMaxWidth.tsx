import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

const getNumberValue = (spacing: number | string | undefined): number => {
  switch (typeof spacing) {
    case 'number':
      return spacing;
    case 'string':
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          'Using string values for paddings/margins are not supported on HtmlNodeImage/HtmlView'
        );
      }
      return 0;
    default:
    case 'undefined':
      return 0;
  }
};

interface Options {
  includeMargins?: boolean;
}

export const getActualMaxWidth = (
  maxWidth: number,
  style: StyleProp<ViewStyle>,
  { includeMargins = true }: Options = {}
): number => {
  if (style) {
    const flattenedStyle = StyleSheet.flatten(style);
    const paddingLeft = getNumberValue(flattenedStyle.paddingLeft);
    const paddingRight = getNumberValue(flattenedStyle.paddingRight);
    const paddingHorizontal = getNumberValue(flattenedStyle.paddingHorizontal);
    const padding = getNumberValue(flattenedStyle.padding);
    const marginLeft = includeMargins ? getNumberValue(flattenedStyle.marginLeft) : 0;
    const marginRight = includeMargins ? getNumberValue(flattenedStyle.marginRight) : 0;
    const marginHorizontal = includeMargins ? getNumberValue(flattenedStyle.marginHorizontal) : 0;
    const margin = includeMargins ? getNumberValue(flattenedStyle.margin) : 0;

    return (
      maxWidth -
      paddingLeft -
      paddingRight -
      2 * paddingHorizontal -
      2 * padding -
      marginLeft -
      marginRight -
      2 * marginHorizontal -
      2 * margin
    );
  }
  return maxWidth;
};
