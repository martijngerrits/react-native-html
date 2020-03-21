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

export type DomElement = DomElementBase<DomElement>;
