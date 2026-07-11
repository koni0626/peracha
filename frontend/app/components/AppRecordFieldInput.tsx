import type { User, WorkTableColumn } from "../types";
import { RichMarkdownEditor } from "./RichMarkdownEditor";
import { WorkTableUserSelect } from "./WorkTableUserSelect";

type AppRecordFieldInputProps = {
  column: WorkTableColumn;
  userOptions: User[];
  value: string;
  onChange: (value: string) => void;
};

export function AppRecordFieldInput({ column, userOptions, value, onChange }: AppRecordFieldInputProps) {
  if (column.field_type === "markdown") {
    return <RichMarkdownEditor value={value} onChange={onChange} placeholder="Markdownで入力" />;
  }
  if (column.field_type === "user") {
    return <WorkTableUserSelect value={value} userOptions={userOptions} onChange={onChange} />;
  }
  if (column.field_type === "select") {
    return (
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">未入力</option>
        {column.options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  if (column.field_type === "date") {
    return <input type="date" value={value} onChange={(event) => onChange(event.target.value)} />;
  }
  if (column.field_type === "number") {
    return <input type="number" value={value} onChange={(event) => onChange(event.target.value)} />;
  }
  return <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />;
}
