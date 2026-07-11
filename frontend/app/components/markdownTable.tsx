import { renderInlineMarkdown } from "./markdownInline";

type TableAlignment = "left" | "center" | "right";

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseTableDivider(line: string): TableAlignment[] | null {
  const cells = splitTableRow(line);
  if (cells.length === 0) {
    return null;
  }
  const alignments: TableAlignment[] = [];
  for (const cell of cells) {
    if (!/^:?-{3,}:?$/.test(cell)) {
      return null;
    }
    if (cell.startsWith(":") && cell.endsWith(":")) {
      alignments.push("center");
    } else if (cell.endsWith(":")) {
      alignments.push("right");
    } else {
      alignments.push("left");
    }
  }
  return alignments;
}

export function isMarkdownTableCandidate(current: string, next: string | undefined) {
  return current.includes("|") && Boolean(next && parseTableDivider(next));
}

export function MarkdownTable({
  bodyLines,
  dividerLine,
  headerLine,
  tableKey,
}: {
  bodyLines: string[];
  dividerLine: string;
  headerLine: string;
  tableKey: string;
}) {
  const headers = splitTableRow(headerLine);
  const alignments = parseTableDivider(dividerLine) ?? headers.map(() => "left" as const);
  const rows = bodyLines.map(splitTableRow);

  return (
    <div className="markdownTableWrap">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`${tableKey}-h-${index}`} style={{ textAlign: alignments[index] ?? "left" }}>
                {renderInlineMarkdown(header, `${tableKey}-h-${index}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${tableKey}-r-${rowIndex}`}>
              {headers.map((_, cellIndex) => (
                <td key={`${tableKey}-r-${rowIndex}-${cellIndex}`} style={{ textAlign: alignments[cellIndex] ?? "left" }}>
                  {renderInlineMarkdown(row[cellIndex] ?? "", `${tableKey}-r-${rowIndex}-${cellIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
