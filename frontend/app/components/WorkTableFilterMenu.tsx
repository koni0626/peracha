import type { WorkTableColumn } from "../types";
import type { FilterMenuState } from "./workTablePanelTypes";

type WorkTableFilterMenuProps = {
  column: WorkTableColumn;
  menu: FilterMenuState;
  selectedValues: string[];
  values: string[];
  onClearAll: () => void;
  onClearColumn: () => void;
  onClose: () => void;
  onToggleValue: (value: string) => void;
};

export function WorkTableFilterMenu({
  column,
  menu,
  selectedValues,
  values,
  onClearAll,
  onClearColumn,
  onClose,
  onToggleValue,
}: WorkTableFilterMenuProps) {
  return (
    <div className="workTableFilterMenu" style={{ left: menu.left, top: menu.top }}>
      <div className="workTableFilterMenuHeader">
        <div>
          <span>FILTER</span>
          <strong>{column.name}</strong>
        </div>
        <button type="button" onClick={onClose}>
          閉じる
        </button>
      </div>
      <div className="workTableFilterOptions">
        {values.length > 0 ? (
          values.map((value) => (
            <label key={value || "__blank__"}>
              <input type="checkbox" checked={selectedValues.includes(value)} onChange={() => onToggleValue(value)} />
              <span>{value || "(空白)"}</span>
            </label>
          ))
        ) : (
          <p>絞り込みできる値がありません。</p>
        )}
      </div>
      <div className="workTableFilterMenuFooter">
        <button type="button" onClick={onClearColumn}>
          この列を解除
        </button>
        <button type="button" onClick={onClearAll}>
          すべて解除
        </button>
      </div>
    </div>
  );
}
