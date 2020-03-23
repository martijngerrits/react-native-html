import { createDefaultTagHandlers } from './parseTags';
import { parseElement } from './parseElement';
import { NodeBase, InternalLinkNode } from './types/nodes';
import { CustomParser } from './types/customParser';
import { DomElement, hasElementClassName, DomIdMap } from './types/elements';
import { TagHandler } from './types/tags';
import { parseElementChildrenWith } from './parseElementChildrenWith';

interface ParseElementsArgs {
  elements: DomElement[];
  nodes: NodeBase[];
  internalLinkNodes: InternalLinkNode[];
  tagHandlers?: TagHandler[];
  customParser?: CustomParser;
  excludeTags: Set<string>;
  domIdToKeys: DomIdMap;
  nodeMap: Map<string, NodeBase>;
  parseFromCssClass?: string;
}

export function parseElements({
  elements,
  nodes,
  tagHandlers = createDefaultTagHandlers(),
  customParser,
  excludeTags,
  internalLinkNodes,
  domIdToKeys,
  nodeMap,
  parseFromCssClass,
}: ParseElementsArgs) {
  let selectedElements: DomElement[];
  if (parseFromCssClass) {
    const element = getElementByCssClass(elements, parseFromCssClass);
    selectedElements = element ? [element] : [];
  } else {
    selectedElements = elements;
  }
  parseElementChildrenWith(selectedElements, parseElement, {
    internalLinkNodes,
    nodes,
    tagHandlers,
    customParser,
    excludeTags,
    domIdToKeys,
    nodeMap,
  });
}

const getElementByCssClass = (elements: DomElement[], cssClass: string) => {
  // eslint-disable-next-line prefer-const
  const result: { element?: DomElement } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const element of elements) {
    visitElements(element, cssClass, result);
    if (result.element) {
      break;
    }
  }

  return result.element ? result.element : undefined;
};

const visitElements = (element: DomElement, cssClass: string, result: { element?: DomElement }) => {
  if (hasElementClassName(element, cssClass)) {
    // eslint-disable-next-line no-param-reassign
    result.element = element;
  } else if (element.children) {
    element.children.forEach(child => visitElements(child, cssClass, result));
  }
};
