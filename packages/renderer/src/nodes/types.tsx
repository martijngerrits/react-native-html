import { LayoutChangeEvent } from 'react-native';

export type onLayoutHandler = (event: LayoutChangeEvent) => void;

export interface MinimalScrollView {
  scrollTo(
    y?: number | { x?: number; y?: number; animated?: boolean },
    x?: number,
    animated?: boolean
  ): void;
}
