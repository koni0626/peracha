import { spreadsheetColumnName } from "./officeSpreadsheetUtils";

type SpreadsheetPreviewProps = {
  activeSheet: string;
  rows: string[][];
  sheetNames: string[];
  setActiveSheet: (sheetName: string) => void;
};

export function SpreadsheetPreview({ activeSheet, rows, sheetNames, setActiveSheet }: SpreadsheetPreviewProps) {
  const columnCount = rows.reduce((count, row) => Math.max(count, row.length), 0);

  return (
    <div className="spreadsheetPreview">
      <div className="sheetTabs">
        {sheetNames.map((sheetName) => (
          <button
            type="button"
            className={sheetName === activeSheet ? "active" : ""}
            key={sheetName}
            onClick={() => setActiveSheet(sheetName)}
          >
            {sheetName}
          </button>
        ))}
      </div>
      <div className="spreadsheetGridWrap">
        <table className="spreadsheetGrid">
          <thead>
            <tr>
              <th className="cornerCell" />
              {Array.from({ length: columnCount }, (_, index) => (
                <th key={index}>{spreadsheetColumnName(index)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th>
                {Array.from({ length: columnCount }, (_, columnIndex) => (
                  <td key={columnIndex}>{row[columnIndex]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
