// eslint-disable-next-line prettier/prettier
import type { ParseElementArgs } from './parseElement';
import {
  DomElement,
  ParseElementArgsBase,
} from './types/elements';


export interface ParseElementChildrenArgs extends ParseElementArgsBase {
  excludeTags: Set<string>;
  pathIds?: string[];
}


export const parseElementChildrenWith = (
  children: DomElement[] | undefined,
  parseElement: (parserArgs: ParseElementArgs) => void,
  {
    pathIds = [],
    excludeTags,
    tagHandlers,
    customParser,
    nodeReferences,
    blockManager,
    nodeRelationshipManager: nodeRelationShipManager,
  }: ParseElementChildrenArgs
) => {
  if (!children) return;

  // let childGroup: NodeRelationshipManager
  // if (parentChildGroup && parentChildGroup.isWithinTextContainer()) {
  //   childGroup = new NodeRelationshipManager(
  //     parentChildGroup.getKeyPrefixAtTextContainerLevel(),
  //     parentChildGroup.getNodesAtTextContainerLevel(),
  //     parentChildGroup.getParentNodeAtTextContainerLevel()
  //   );
  //   const textContainer = parentChildGroup?.getCurrentTextContainer();
  //   if (textContainer) {
  //     childGroup.addTextContainer(textContainer);
  //   }
  // } else {
  //   childGroup = new NodeRelationshipManager(keyPrefix, nodes, parentNode);
  // }

  children.forEach(child => {
    const block = blockManager.getBlockForNextElement(child, nodeRelationShipManager);
    if (!child.name || !excludeTags.has(child.name)) {
      parseElement({
        element: child,
        parentPathIds: pathIds,
        tagHandlers,
        customParser,
        excludeTags,
        nodeReferences,
        nodeRelationshipManager: nodeRelationShipManager,
        blockManager,
        block
      });
    }
  });
};
