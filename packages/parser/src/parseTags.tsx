import { decodeHTML } from 'entities';
import { Node } from 'domhandler';
import { getOuterHTML } from 'domutils';

import {
  NodeType,
  ListNode,
  ImageNode,
  ListItemNode,
  IFrameNode,
  NodeBase,
  NodeWithoutKey,
  TextNode,
  isTextNode,
  TableNode,
} from './types/nodes';
import { getElementAttribute, DomElement } from './types/elements';
import { NodeRelationshipManager } from './nodes/NodeRelationshipManager';

export interface TagParser {
  resolver: (args: TagResolverArgs) => NodeWithoutKey | undefined;
  canParseChildren: boolean;
}

export interface TagResolverArgs {
  element: DomElement;
  children: NodeBase[];
  nodeRelationshipManager: NodeRelationshipManager;
  header?: number;
  isBold: boolean;
  isItalic: boolean;
  hasStrikethrough: boolean;
  isUnderlined: boolean;
  isWithinTextContainer: boolean;
  isWithinLink: boolean;
  isWithinList: boolean;
}

const getWidthAndHeight = (element: DomElement): { width?: number; height?: number } => {
  const width =
    Number.parseInt(getElementAttribute(element, 'width') ?? '0', 10) ||
    Number.parseInt(getElementAttribute(element, 'data-width') ?? '0', 10) ||
    undefined;
  const height =
    Number.parseInt(getElementAttribute(element, 'height') ?? '0', 10) ||
    Number.parseInt(getElementAttribute(element, 'data-height') ?? '0', 10) ||
    undefined;

  return { width, height };
};

export interface ParserPerTag {
  [tagName: string]: TagParser;
}

export const createDefaultParserPerTag = (): ParserPerTag => {
  const parserPerTag: ParserPerTag = {};
  const linkParser = {
    canParseChildren: true,
    resolver: ({ element, children, isWithinTextContainer }: TagResolverArgs) => {
      if (element.name !== 'a' || !element.attribs) return undefined;
      let source = getElementAttribute(element, 'href');
      if (!source) return undefined;

      if (source.startsWith('#')) {
        const domId = source.slice(1);
        return {
          type: NodeType.InternalLink,
          targetKey: '', // will be added later
          hasResolvedTarget: false,
          children,
          domId,
          isWithinTextContainer,
        };
      }

      source = decodeHTML(source);

      return {
        type: NodeType.Link,
        source,
        children,
        isWithinTextContainer,
      };
    },
  };
  parserPerTag.a = linkParser;

  const imageParser = {
    canParseChildren: false,
    resolver: ({ element }: TagResolverArgs) => {
      if (element.name !== 'img' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.Image,
        source,
        width,
        height,
      } as ImageNode;
    },
  };
  parserPerTag.img = imageParser;

  const listItemParser = {
    canParseChildren: true,
    resolver: ({ children }: TagResolverArgs) => {
      return {
        children,
        type: NodeType.ListItem,
      } as ListItemNode;
    },
  };
  parserPerTag.li = listItemParser;

  const listParser = {
    canParseChildren: true,
    resolver: ({ children, element }: TagResolverArgs) => {
      return {
        children,
        isOrdered: element.name === 'ol',
        type: NodeType.List,
      } as ListNode;
    },
  };
  parserPerTag.ol = listParser;
  parserPerTag.ul = listParser;

  const breakParser = {
    canParseChildren: false,
    resolver: ({
      header,
      isBold,
      isItalic,
      hasStrikethrough,
      isUnderlined,
      isWithinTextContainer,
      isWithinLink,
      isWithinList,
      nodeRelationshipManager,
    }: TagResolverArgs) => {
      // try to add to previous text node if any
      const nodes = nodeRelationshipManager.getNodes();
      if (nodes.length > 0) {
        const prevNode = nodes[nodes.length - 1];
        if (isTextNode(prevNode)) {
          prevNode.content += '\n';
          return undefined;
        }
      }
      return {
        type: NodeType.Text,
        content: '\n',
        header,
        isBold,
        isItalic,
        hasStrikethrough,
        isUnderlined,
        isWithinTextContainer,
        isWithinLink,
        isWithinList,
        canBeTextContainerBase: true,
        isAfterHeader: false,
      } as TextNode;
    },
  };
  parserPerTag.br = breakParser;

  const iframeParser = {
    canParseChildren: false,
    resolver: ({ element }: TagResolverArgs) => {
      if (element.name !== 'iframe' || !element.attribs) return undefined;
      const { width, height } = getWidthAndHeight(element);
      const source = decodeHTML(element.attribs?.src ?? '');
      if (!source) return undefined;

      return {
        type: NodeType.IFrame,
        source,
        width,
        height,
      } as IFrameNode;
    },
  };
  parserPerTag.iframe = iframeParser;

  const tableParser = {
    canParseChildren: false,
    resolver: ({ element }: TagResolverArgs) => {
      if (element.name !== 'table') return undefined;

      return {
        type: NodeType.Table,
        source: `${getOuterHTML(element as Node)}`,
      } as TableNode;
    },
  }
  parserPerTag.table = tableParser;

  return parserPerTag;
};
