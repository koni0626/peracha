import { renderMarkdownCodeBlock, renderMarkdownList, renderMarkdownParagraph } from "./richMarkdownBlockRenderers";

export type MarkdownTransformState = {
  blocks: string[];
  codeLines: string[];
  inCodeBlock: boolean;
  listItems: string[];
  orderedListItems: string[];
  paragraph: string[];
};

export function createMarkdownTransformState(): MarkdownTransformState {
  return {
    blocks: [],
    codeLines: [],
    inCodeBlock: false,
    listItems: [],
    orderedListItems: [],
    paragraph: [],
  };
}

export function flushEditorParagraph(state: MarkdownTransformState) {
  if (!state.paragraph.length) {
    return;
  }
  state.blocks.push(renderMarkdownParagraph(state.paragraph));
  state.paragraph = [];
}

export function flushEditorLists(state: MarkdownTransformState) {
  if (state.listItems.length) {
    state.blocks.push(renderMarkdownList("ul", state.listItems));
    state.listItems = [];
  }
  if (state.orderedListItems.length) {
    state.blocks.push(renderMarkdownList("ol", state.orderedListItems));
    state.orderedListItems = [];
  }
}

export function flushOpenEditorCodeBlock(state: MarkdownTransformState) {
  if (state.inCodeBlock) {
    state.blocks.push(renderMarkdownCodeBlock(state.codeLines));
  }
}

export function toggleEditorCodeBlock(state: MarkdownTransformState) {
  flushEditorParagraph(state);
  flushEditorLists(state);
  if (state.inCodeBlock) {
    state.blocks.push(renderMarkdownCodeBlock(state.codeLines));
    state.codeLines = [];
  }
  state.inCodeBlock = !state.inCodeBlock;
}
