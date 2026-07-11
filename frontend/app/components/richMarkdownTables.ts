import { inlineMarkdownToHtml, inlineNodeToMarkdown } from "./richMarkdownInline";

export function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function isTableDivider(line: string | undefined) {
  return Boolean(line && splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell)));
}

export function markdownTableToHtml(headers: string[], rows: string[][]) {
  return `<table><thead><tr>${headers.map((header) => `<th>${inlineMarkdownToHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(
      (row) =>
        `<tr>${headers
          .map((_, cellIndex) => {
            const content = inlineMarkdownToHtml(row[cellIndex] ?? "");
            return `<td>${content || "<br>"}</td>`;
          })
          .join("")}</tr>`
    )
    .join("")}</tbody></table>`;
}

export function markdownTableBlockToHtml(lines: string[], startIndex: number) {
  const headers = splitTableRow(lines[startIndex]);
  const rows: string[][] = [];
  let index = startIndex + 2;
  while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
    rows.push(splitTableRow(lines[index]));
    index += 1;
  }
  return {
    html: markdownTableToHtml(headers, rows),
    nextIndex: index - 1,
  };
}

export function tableToMarkdown(table: HTMLTableElement) {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (!rows.length) {
    return "";
  }
  const firstRowCells = Array.from(rows[0].children).map((cell) => inlineNodeToMarkdown(cell).trim() || " ");
  const bodyRows = rows.slice(1).map((row) => Array.from(row.children).map((cell) => inlineNodeToMarkdown(cell).trim()));
  return [
    `| ${firstRowCells.join(" | ")} |`,
    `| ${firstRowCells.map(() => "---").join(" | ")} |`,
    ...bodyRows.map((row) => `| ${firstRowCells.map((_, index) => row[index] ?? "").join(" | ")} |`)
  ].join("\n");
}
