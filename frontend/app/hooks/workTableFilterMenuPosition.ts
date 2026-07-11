import type { FilterMenuState } from "../components/workTablePanelTypes";

export function nextFilterMenuState(
  current: FilterMenuState | null,
  columnId: string,
  button: HTMLButtonElement,
): FilterMenuState | null {
  if (current?.columnId === columnId) {
    return null;
  }
  const grid = button.closest(".workTableGridWrap");
  const gridRect = grid?.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  if (!gridRect) {
    return { columnId, left: 0, top: 0 };
  }
  const menuWidth = 320;
  const left = Math.min(
    Math.max(8, buttonRect.left - gridRect.left - menuWidth + buttonRect.width),
    Math.max(8, gridRect.width - menuWidth - 8),
  );
  return {
    columnId,
    left,
    top: buttonRect.bottom - gridRect.top + 6,
  };
}
