import type { User, WorkTableColumn, WorkTableRecord } from "../types";
import {
  WorkTableReadonlyBlankValue,
  WorkTableReadonlyFileValue,
  WorkTableReadonlyFolderValue,
  WorkTableReadonlyTextValue,
} from "./WorkTableReadonlyCellParts";
import { inputValue, isWorkTableFileValue, isWorkTableFolderValue } from "./workTableValueUtils";

type WorkTableReadonlyCellProps = {
  column: WorkTableColumn;
  record: WorkTableRecord;
  userOptions: User[];
};

export function WorkTableReadonlyCell({ column, record, userOptions }: WorkTableReadonlyCellProps) {
  const rawValue = record.values[column.id];
  if (isWorkTableFileValue(rawValue)) {
    return <WorkTableReadonlyFileValue file={rawValue.file} />;
  }
  if (isWorkTableFolderValue(rawValue)) {
    return <WorkTableReadonlyFolderValue fileCount={rawValue.files.length} />;
  }

  const value = inputValue(rawValue);
  if (!value) {
    return <WorkTableReadonlyBlankValue />;
  }
  if (column.field_type === "user") {
    const matchedUser = userOptions.find((user) => user.name === value || user.id === value || user.email === value);
    return <WorkTableReadonlyTextValue value={matchedUser?.name ?? value} />;
  }
  return <WorkTableReadonlyTextValue value={value} />;
}
