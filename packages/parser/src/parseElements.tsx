// eslint-disable-next-line import/no-unresolved
import { DomElement } from 'htmlparser2';

import { createDefaultTagHandlers, TagHandler } from './parseTags';
import { parseElement } from './parseElement';
import { getPathName, NodeBase, InternalLinkNode } from './nodes';
import { CustomParser } from './customParser';
import { DomIdMap } from './domIdToKey';

interface ParseElementsArgs {
  elements: DomElement[];
  nodes: NodeBase[];
  internalLinkNodes: InternalLinkNode[];
  tagHandlers?: TagHandler[];
  customParser?: CustomParser;
  excludeTags: Set<string>;
  domIdToKeys: DomIdMap;
  nodeMap: Map<string, NodeBase>;
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
}: ParseElementsArgs) {
  elements.forEach(element => {
    const pathName = getPathName(element);
    if (!excludeTags.has(pathName)) {
      parseElement({
        element,
        pathName,
        internalLinkNodes,
        nodes,
        tagHandlers,
        customParser,
        excludeTags,
        domIdToKeys,
        nodeMap,
      });
    }
  });
}
