import type { ReactNode } from "react";

import { MarkdownTable } from "./markdownTable";

export function collectMarkdownTable(lines: string[], startIndex: number) {
  const dividerLine = lines[startIndex + 1];
  const bodyLines: string[] = [];
  let index = startIndex + 2;
  while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
    bodyLines.push(lines[index]);
    index += 1;
  }
  return {
    bodyLines,
    dividerLine,
    nextIndex: index - 1,
  };
}

export function pushMarkdownTableBlock(
  blocks: ReactNode[],
  headerLine: string,
  dividerLine: string,
  bodyLines: string[],
  key: string
) {
  blocks.push(
    <MarkdownTable
      bodyLines={bodyLines}
      dividerLine={dividerLine}
      headerLine={headerLine}
      key={`${key}-table`}
      tableKey={`${key}-table`}
    />
  );
}
