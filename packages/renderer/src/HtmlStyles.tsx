import { StyleProp, ViewStyle, TextStyle, ImageStyle, FlexStyle } from 'react-native';

export interface BasicStyle extends FlexStyle {
  overflow?: 'visible' | 'hidden';
}

export interface HtmlListStyles {
  list?: StyleProp<ViewStyle>;
  orderedList?: StyleProp<ViewStyle>;
  unorderedList?: StyleProp<ViewStyle>;
  listItem?: StyleProp<ViewStyle>;
  orderedListItem?: StyleProp<ViewStyle>;
  unorderedListItem?: StyleProp<ViewStyle>;
  listItemBullet?: StyleProp<TextStyle>;
  listItemNumber?: StyleProp<TextStyle>;
  listItemContent?: StyleProp<ViewStyle>;
}

export interface HtmlHeaderStyles {
  h1?: StyleProp<TextStyle>;
  h2?: StyleProp<TextStyle>;
  h3?: StyleProp<TextStyle>;
  h4?: StyleProp<TextStyle>;
  h5?: StyleProp<TextStyle>;
  h6?: StyleProp<TextStyle>;
}

export interface HtmlStyles extends HtmlListStyles, HtmlHeaderStyles {
  paragraph?: StyleProp<TextStyle>; // stand-alone text or text container
  text?: StyleProp<TextStyle>;
  image?: StyleProp<ImageStyle>;
  link?: StyleProp<TextStyle>;
  touchable?: StyleProp<ViewStyle>;
  iframe?: StyleProp<ViewStyle>;
  firstChildInListItem?: StyleProp<BasicStyle>;
}
