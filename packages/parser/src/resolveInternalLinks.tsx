import { InternalLinkNode, NodeBase, isTextNode, NodeType } from './nodes';

interface ResolveInternalLinkArgs {
  internalLinkNodes: InternalLinkNode[];
  nodeMap: Map<string, NodeBase>;
  keyToPathIds: Map<string, string[]>;
}

export const resolveInternalLinks = ({
  internalLinkNodes,
  nodeMap,
  keyToPathIds,
}: ResolveInternalLinkArgs) => {
  internalLinkNodes.forEach(referringNode => {
    const referredNode = findNodeByDomId(referringNode, nodeMap, keyToPathIds);
    if (referredNode) {
      referredNode.isLinkedTo = true;
      /* eslint-disable no-param-reassign */
      referringNode.targetKey = referredNode.key;
      referringNode.hasResolvedTarget = true;
      /* eslint-enable no-param-reassign */
    } else {
      // remove withinLink value
      unflagWithinLink(referringNode);
    }
  });
};

const findNodeByDomId = (
  node: InternalLinkNode,
  nodeMap: Map<string, NodeBase>,
  keyToPathIds: Map<string, string[]>
): NodeBase | undefined => {
  let closestLevel = Number.MAX_SAFE_INTEGER;
  let selectedKey: string | null = null;
  // find the dom id
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, pathIds] of keyToPathIds.entries()) {
    // skip own node
    if (node.key !== key) {
      let currentLevel = 0;
      let shouldBreak = false;
      for (let i = pathIds.length - 1; i > -1; i -= 1) {
        if (pathIds[i] === node.domId && currentLevel < closestLevel) {
          closestLevel = currentLevel;
          selectedKey = key;
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
  }
  return (selectedKey && nodeMap.get(selectedKey)) || undefined;
};

const linkTypes = new Set<string>([NodeType.Link, NodeType.InternalLink]);

const unflagWithinLink = (node: NodeBase) => {
  if (isTextNode(node)) {
    // eslint-disable-next-line no-param-reassign
    node.isWithinLink = false;
  }
  if (node.children) {
    node.children.forEach(child => {
      if (!linkTypes.has(child.type)) {
        unflagWithinLink(child);
      }
    });
  }
};
