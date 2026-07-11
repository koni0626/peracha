import type { ChangeEvent, FocusEvent } from "react";

import type { User, WorkTableColumn } from "../types";
import { WorkTableMarkdownCellInput } from "./WorkTableMarkdownCellInput";
import { WorkTableUserSelect } from "./WorkTableUserSelect";

export type WorkTableScalarInputProps = {
  column: WorkTableColumn;
  userOptions: User[];
  value: string;
  onDraftChange: (value: string) => void;
  onSave: (value: string) => void | Promise<void>;
};

type ScalarInputElement = HTMLInputElement | HTMLSelectElement;

function useScalarInputProps({
  value,
  onDraftChange,
  onSave,
}: Omit<WorkTableScalarInputProps, "column" | "userOptions">) {
  return {
    value,
    onChange: (event: ChangeEvent<ScalarInputElement>) => onDraftChange(event.target.value),
    onBlur: (event: FocusEvent<ScalarInputElement>) => {
      void onSave(event.target.value);
    },
  };
}

export function WorkTableScalarInput({ column, userOptions, value, onDraftChange, onSave }: WorkTableScalarInputProps) {
  const commonProps = useScalarInputProps({ value, onDraftChange, onSave });

  if (column.field_type === "markdown") {
    return <WorkTableMarkdownCellInput value={value} onDraftChange={onDraftChange} onSave={onSave} />;
  }
  if (column.field_type === "date") {
    return <input {...commonProps} type="date" />;
  }
  if (column.field_type === "number") {
    return <input {...commonProps} type="number" />;
  }
  if (column.field_type === "select") {
    return (
      <select {...commonProps}>
        <option value=""></option>
        {column.options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  if (column.field_type === "user") {
    return <WorkTableUserSelect value={value} userOptions={userOptions} onChange={onDraftChange} onBlur={onSave} />;
  }
  return <input {...commonProps} type="text" />;
}
