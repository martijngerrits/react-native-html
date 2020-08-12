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

type HtmlTableElementBaseViewStyleBackgroundColorKeys = 'backgroundColor';
type HtmlTableElementBaseViewStylePaddingKeys = 'padding' | 'paddingHorizontal' | 'paddingVertical';
type HtmlTableElementBaseTextStyleKeys = 'color' | 'fontSize' | 'fontWeight' | 'textAlign';

type HtmlElementTableCelStyleKeys =
  HtmlTableElementBaseViewStyleBackgroundColorKeys | HtmlTableElementBaseViewStylePaddingKeys;

type MergePick<T> = {[K in keyof T]: T[K]}

export type HtmlTableCellStyles =
  MergePick<Pick<ViewStyle, HtmlElementTableCelStyleKeys> & Pick<TextStyle, HtmlTableElementBaseTextStyleKeys>>;
export type HtmlTableStylesEvenOdd =
  MergePick<Pick<ViewStyle, HtmlTableElementBaseViewStyleBackgroundColorKeys> & Pick<TextStyle, HtmlTableElementBaseTextStyleKeys>>;

export interface HtmlTableStyles {
  th?: StyleProp<HtmlTableCellStyles>;
  tr?: StyleProp<HtmlTableCellStyles>;
  td?: StyleProp<HtmlTableCellStyles>;
  even?: StyleProp<HtmlTableStylesEvenOdd>;
  odd?: StyleProp<HtmlTableStylesEvenOdd>;
}

export interface HtmlStyles extends HtmlListStyles, HtmlHeaderStyles {
  paragraph?: StyleProp<TextStyle>; // stand-alone text or text container
  paragraphAfterHeader?: StyleProp<TextStyle>;
  text?: StyleProp<TextStyle>;
  image?: StyleProp<ImageStyle>;
  link?: StyleProp<TextStyle>;
  touchable?: StyleProp<ViewStyle>;
  iframe?: StyleProp<ViewStyle>;
  firstChildInListItem?: StyleProp<BasicStyle>;
  table?: HtmlTableStyles,
}
