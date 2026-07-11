import type { WorkTableColumn } from "../types";

type AppViewColumnSelectProps = {
  columns: WorkTableColumn[];
  label: string;
  value: string;
  allowEmpty?: boolean;
  onChange: (columnId: string) => void;
};

export function AppViewColumnSelect({ columns, label, value, allowEmpty = false, onChange }: AppViewColumnSelectProps) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {allowEmpty ? <option value="">未指定</option> : null}
        {columns.map((column) => (
          <option value={column.id} key={column.id}>
            {column.name}
          </option>
        ))}
      </select>
    </label>
  );
}
