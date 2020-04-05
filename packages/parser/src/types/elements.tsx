export interface DomElementBase<T> {
  attribs?: { [s: string]: string };
  children?: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  name?: string;
  next?: T;
  parent?: T;
  prev?: T;
  type?: string;
}

export interface TextElement extends DomElementBase<DomElement> {
  children: undefined;
  attribs: undefined;
  name: undefined;
  data: string;
  type: 'text';
}
export const isTextElement = (element: DomElement): element is TextElement =>
  element.type === 'text';

export interface TagElement extends DomElementBase<DomElement> {
  attribs: { [s: string]: string };
  data: undefined;
  name: string;
  type: 'tag';
}
export const isTagElement = (element: DomElement): element is TagElement => element.type === 'tag';

export interface KeyInfo {
  key: string;
  steps: number;
}

export type DomIdMap = Map<string /* dom element id */, KeyInfo>;

export type DomElement = DomElementBase<DomElement>;

const onlyWhiteSpacesRegex = /^\s+$/;
export const isOnlyWhiteSpaces = (input: string) => onlyWhiteSpacesRegex.test(input);

// export const isElementText = (element: DomElement) => element.type === TEXT_PATH_NAME;
// export const isElementBreak = (element: DomElement) => element.name === BR_PATH_NAME;

export const isElementNotATextOrNotAnEmptyText = (element: DomElement): boolean => {
  return isTextElement(element) || (element.data && !isOnlyWhiteSpaces(element.data));
};

export const getElementAttribute = (
  element: DomElement,
  attributeName: string
): string | undefined => {
  const attributes = element.attribs;
  if (attributes) {
    if (attributes[attributeName]) {
      return attributes[attributeName];
    }
    // check case insenstive
    const key = Object.keys(attributes).find(
      propertyName => attributeName === propertyName.toLowerCase()
    );
    if (key) {
      return attributes[key];
    }
  }
  return undefined;
};

export const hasElementClassName = (element: DomElement, className: string) => {
  if (element.type === 'tag') {
    const classNames = getElementAttribute(element, 'class');
    if (classNames) {
      const regex = new RegExp(`(?:^| )${className}(?:$| )`);
      return regex.test(classNames);
    }
  }
  return false;
};

export interface ParentBasedFlags {
  isWithinHeader?: number;
  isWithinBold?: boolean;
  isWithinItalic?: boolean;
  isWithinUnderline?: boolean;
  isWithinStrikethrough?: boolean;
  isWithinLink?: boolean;
  isWithinList?: boolean;
}
