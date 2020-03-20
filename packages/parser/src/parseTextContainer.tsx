import { NodeBase, TextContainerNodeWithoutKey, NodeType } from './nodes';

interface ParseTextConatinerArgs {
  children: NodeBase[];
}

export const parseTextContainer = ({
  children,
}: ParseTextConatinerArgs): TextContainerNodeWithoutKey => {
  return {
    type: NodeType.TextContainer,
    children,
  };
};
