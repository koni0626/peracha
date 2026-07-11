import { WorkTableFilterMenu } from "./WorkTableMenus";
import { columnForFilterMenu } from "./workTableMenuSlotUtils";
import type { FilterMenuSlotProps } from "./workTableMenuSlotTypes";

export function FilterMenuSlot({
  activeTable,
  columnFilters,
  menu,
  setColumnFilters,
  setOpenFilterMenu,
  toggleFilterValue,
  uniqueColumnValues,
}: FilterMenuSlotProps) {
  const column = columnForFilterMenu(activeTable, menu);
  if (!column) {
    return null;
  }
  return (
    <WorkTableFilterMenu
      column={column}
      menu={menu}
      selectedValues={columnFilters[column.id] ?? []}
      values={uniqueColumnValues(column)}
      onClearAll={() => {
        setColumnFilters({});
        setOpenFilterMenu(null);
      }}
      onClearColumn={() => setColumnFilters((current) => ({ ...current, [column.id]: [] }))}
      onClose={() => setOpenFilterMenu(null)}
      onToggleValue={(value) => toggleFilterValue(column.id, value)}
    />
  );
}
