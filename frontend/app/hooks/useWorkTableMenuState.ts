import { useEffect } from "react";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import type { ColumnContextMenuState, FilterMenuState, RecordContextMenuState } from "../components/workTablePanelTypes";

type UseWorkTableMenuStateOptions = {
  activeTableId: string | null;
  setColumnContextMenu: Dispatch<SetStateAction<ColumnContextMenuState | null>>;
  setExpandedHistoryRecordIds: Dispatch<SetStateAction<string[]>>;
  setOpenFilterMenu: Dispatch<SetStateAction<FilterMenuState | null>>;
  setRecordContextMenu: Dispatch<SetStateAction<RecordContextMenuState | null>>;
};

export function useWorkTableMenuState({
  activeTableId,
  setColumnContextMenu,
  setExpandedHistoryRecordIds,
  setOpenFilterMenu,
  setRecordContextMenu,
}: UseWorkTableMenuStateOptions) {
  useEffect(() => {
    setOpenFilterMenu(null);
    setColumnContextMenu(null);
    setRecordContextMenu(null);
    setExpandedHistoryRecordIds([]);
  }, [activeTableId, setColumnContextMenu, setExpandedHistoryRecordIds, setOpenFilterMenu, setRecordContextMenu]);

  useEffect(() => {
    function closeMenus() {
      setColumnContextMenu(null);
      setRecordContextMenu(null);
    }
    function closeMenusOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }
    window.addEventListener("click", closeMenus);
    window.addEventListener("keydown", closeMenusOnEscape);
    return () => {
      window.removeEventListener("click", closeMenus);
      window.removeEventListener("keydown", closeMenusOnEscape);
    };
  }, [setColumnContextMenu, setRecordContextMenu]);

  function openColumnContextMenu(event: MouseEvent, column: WorkTableColumn) {
    event.preventDefault();
    setOpenFilterMenu(null);
    setRecordContextMenu(null);
    setColumnContextMenu({ columnId: column.id, x: event.clientX, y: event.clientY });
  }

  function openRecordContextMenu(event: MouseEvent, record: WorkTableRecord) {
    event.preventDefault();
    setOpenFilterMenu(null);
    setColumnContextMenu(null);
    setRecordContextMenu({ recordId: record.id, x: event.clientX, y: event.clientY });
  }

  function openEmptyRecordContextMenu(event: MouseEvent) {
    event.preventDefault();
    setOpenFilterMenu(null);
    setColumnContextMenu(null);
    setRecordContextMenu({ recordId: null, x: event.clientX, y: event.clientY });
  }

  return {
    openColumnContextMenu,
    openEmptyRecordContextMenu,
    openRecordContextMenu,
  };
}
