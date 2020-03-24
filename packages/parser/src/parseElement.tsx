import { NodeBase, NodeWithoutKey, isInternalLinkNode, addNode } from './types/nodes';
import { parseText } from './parseText';
import {
  getElementAttribute,
  hasElementClassName,
  ParseElementArgsBase,
  DomElement,
} from './types/elements';
import { parseElementChildrenWith } from './parseElementChildrenWith';
import { CustomParser } from './types/customParser';
import {
  shouldCreateTextContainer,
  createTextContainerGroup,
  shouldEndTextContainer,
  closeTextContainerGroup,
} from './parseTextContainer';
import { ChildGroup } from './types/childGroups';

export interface ParseElementArgs extends ParseElementArgsBase {
  pathName: string;
  element: DomElement;
  parentPathIds?: string[];
  customParser?: CustomParser;
  childGroup: ChildGroup;
}

export function parseElement({
  element,
  pathName,
  parentPathIds = [],
  tagHandlers,
  customParser,
  isWithinTextContainer,
  isWithinHeader,
  isWithinBold = false,
  isWithinItalic = false,
  isWithinStrikethrough = false,
  isWithinUnderline = false,
  isWithinLink = false,
  isWithinList = false,
  excludeTags,
  nodeMap,
  internalLinkNodes,
  domIdToKeys,
  childGroup,
}: ParseElementArgs) {
  const domElementId = getElementAttribute(element, 'id');
  let pathIds = [...parentPathIds];
  if (domElementId) {
    pathIds.unshift(domElementId);
  }

  let canParseChildren = true;
  let parsedNode: NodeWithoutKey | null = null;

  if (shouldCreateTextContainer({ childGroup, element, pathName })) {
    const textContainerGroup = createTextContainerGroup(childGroup);
    childGroup.setTextContainerGroup(textContainerGroup);

    addNode({
      keyPrefix: childGroup.getKeyPrefixAtChildGroupLevel(),
      nodes: childGroup.getNodesAtChildGroupLevel(),
      node: textContainerGroup.textContainerNode,
      pathIds,
      domIdToKeys,
      nodeMap,
      parentNode: childGroup.getParentNodeAtChildGroupLevel(),
    });
    pathIds = [];
  }

  const customParseResult =
    customParser &&
    customParser({
      element,
      pathIds,
      isWithinTextContainer: isWithinTextContainer || childGroup.isWithinTextContainer(),
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinLink,
      isWithinList,
      domElementId,
      hasClassName: (className: string) => hasElementClassName(element, className),
    });
  if (customParseResult?.node) {
    parsedNode = customParseResult.node;
  } else if (element.type === 'text') {
    const textNode = parseText({
      element,
      header: isWithinHeader,
      isBold: isWithinBold,
      isItalic: isWithinItalic,
      isUnderlined: isWithinUnderline,
      hasStrikethrough: isWithinStrikethrough,
      isWithinTextContainer: isWithinTextContainer || childGroup.isWithinTextContainer(),
      isWithinLink,
      isWithinList,
      parentNode: childGroup.getParentNode(),
      isTextContainerFirstChild: childGroup.isTextContainerFirstChild(),
    });
    if (textNode) {
      parsedNode = textNode;
    }
  } else if (element.type === 'tag') {
    tagHandlers.forEach(tagHandler => {
      if (element.name && tagHandler.names.has(element.name)) {
        canParseChildren = tagHandler.canParseChildren;
        const children: NodeBase[] = [];
        const nodeWithoutKey = tagHandler.resolver({
          element,
          children,
          isWithinTextContainer: isWithinTextContainer || childGroup.isWithinTextContainer(),
        });
        if (nodeWithoutKey) {
          parsedNode = nodeWithoutKey;
        }
      }
    });
  }

  if (shouldEndTextContainer({ pathName, childGroup })) {
    closeTextContainerGroup(childGroup);
  }

  let node: NodeBase | undefined;
  if (parsedNode) {
    node = addNode({
      keyPrefix: childGroup.getKeyPrefix(),
      nodes: childGroup.getNodes(),
      node: parsedNode,
      pathIds,
      domIdToKeys,
      nodeMap,
      parentNode: childGroup.getParentNode(),
    });

    pathIds = [];

    if (isInternalLinkNode(node)) {
      internalLinkNodes.push(node);
    }
  }

  // allow the custom parser to control whether children should be parsed
  if (typeof customParseResult?.continueParsingChildren !== 'undefined') {
    canParseChildren = customParseResult.continueParsingChildren;
  }

  if (canParseChildren) {
    // Note: one special node can be added in parseElmentChildren -> TextContainerNode
    parseElementChildrenWith(element.children, parseElement, {
      parentPathName: pathName,
      excludeTags,
      domIdToKeys,
      parentNode: node?.children ? node : childGroup.getParentNode(),
      nodes: node?.children ?? childGroup.getNodes(),
      keyPrefix: node?.children ? node.key : childGroup.getKeyPrefix(),
      parentChildGroup: childGroup,
      shouldContinueAddingChildrenToTextContainer:
        childGroup.isWithinTextContainer() && !node?.children,
      pathIds,
      nodeMap,
      tagHandlers,
      internalLinkNodes,
      customParser,
      isWithinTextContainer: childGroup.isWithinTextContainer(),
      isWithinHeader,
      isWithinBold,
      isWithinItalic,
      isWithinUnderline,
      isWithinStrikethrough,
      isWithinLink,
      isWithinList,
    });
  }
}
