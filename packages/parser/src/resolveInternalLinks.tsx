import { InternalLinkNode, NodeBase } from './nodes';

interface ResolveInternalLinkArgs {
  internalLinkNodes: InternalLinkNode[];
  nodeMap: Map<string, NodeBase>;
  hashToPathIds: Map<string, string[]>;
}

export const resolveInternalLinks = ({
  internalLinkNodes,
  nodeMap,
  hashToPathIds,
}: ResolveInternalLinkArgs) => {
  internalLinkNodes.forEach(referringNode => {
    const referredNode = findNodeByDomId(referringNode, nodeMap, hashToPathIds);
    if (referredNode) {
      referredNode.isLinkedTo = true;
      // eslint-disable-next-line no-param-reassign
      referringNode.linkHash = referredNode.hash;
    }
  });
};

const findNodeByDomId = (
  node: InternalLinkNode,
  nodeMap: Map<string, NodeBase>,
  hashToPathIds: Map<string, string[]>
): NodeBase | undefined => {
  let closestLevel = Number.MAX_SAFE_INTEGER;
  let selectedHash: string | null = null;
  // find the dom id
  // eslint-disable-next-line no-restricted-syntax
  for (const [hash, pathIds] of hashToPathIds.entries()) {
    let currentLevel = 0;
    let shouldBreak = false;
    for (let i = pathIds.length - 1; i > -1; i -= 1) {
      if (pathIds[i] === node.domId && currentLevel < closestLevel) {
        closestLevel = currentLevel;
        selectedHash = hash;
        if (closestLevel === 0) {
          shouldBreak = true;
        }
      }
      currentLevel += 1;
    }
    if (shouldBreak) {
      break;
    }
  }
  return (selectedHash && nodeMap.get(selectedHash)) || undefined;
};
