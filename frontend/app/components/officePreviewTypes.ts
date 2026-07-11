export type WorkbookPreview = {
  sheetNames: string[];
  sheets: Record<string, string[][]>;
};

export type PptSlidePreview = {
  title: string;
  lines: string[];
};
