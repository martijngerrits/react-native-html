import { InternalLinkNode, NodeBase, isTextNode, NodeType } from './nodes';
import { DomIdMap } from './domIdToKey';

interface ResolveInternalLinkArgs {
  internalLinkNodes: InternalLinkNode[];
  nodeMap: Map<string, NodeBase>;
  domIdToKeys: DomIdMap;
}

export const resolveInternalLinks = ({
  internalLinkNodes,
  nodeMap,
  domIdToKeys,
}: ResolveInternalLinkArgs) => {
  internalLinkNodes.forEach(referringNode => {
    const referredNode = findNodeByDomId(referringNode, nodeMap, domIdToKeys);
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
  internalLinkNode: InternalLinkNode,
  nodeMap: Map<string, NodeBase>,
  domIdToKeys: DomIdMap
): NodeBase | undefined => {
  const keyInfo = domIdToKeys.get(internalLinkNode.domId);
  if (keyInfo) {
    let node = nodeMap.get(keyInfo.key);
    while (node) {
      if (!node.isWithinTextContainer) {
        node.isLinkedTo = true;
        return node;
      }
      node.isLinkedTo = undefined;
      node = node.parentKey ? nodeMap.get(node.parentKey) : undefined;
    }
  }
  return undefined;
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
