import type { WorkTable } from "../types";

type AppViewTableSelectProps = {
  selectedTable: WorkTable | null;
  tables: WorkTable[];
  setSelectedTableId: (tableId: string) => void;
};

export function AppViewTableSelect({ selectedTable, tables, setSelectedTableId }: AppViewTableSelectProps) {
  return (
    <label>
      テーブル
      <select value={selectedTable?.id ?? ""} onChange={(event) => setSelectedTableId(event.target.value)}>
        {tables.map((table) => (
          <option value={table.id} key={table.id}>
            {table.name}
          </option>
        ))}
      </select>
    </label>
  );
}
