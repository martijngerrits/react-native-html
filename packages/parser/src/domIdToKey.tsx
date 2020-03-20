export interface KeyInfo {
  key: string;
  steps: number;
}

export type DomIdMap = Map<string /* dom id */, KeyInfo>;
