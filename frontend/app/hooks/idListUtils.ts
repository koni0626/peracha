export function prependUniqueById<T extends { id: string }>(current: T[], item: T, limit: number) {
  return [item, ...current.filter((currentItem) => currentItem.id !== item.id)].slice(0, limit);
}

export function appendUniqueById<T extends { id: string }>(current: T[], item: T) {
  return current.some((currentItem) => currentItem.id === item.id) ? current : [...current, item];
}

export function replaceById<T extends { id: string }>(current: T[], item: T) {
  return current.map((currentItem) => (currentItem.id === item.id ? item : currentItem));
}

export function removeById<T extends { id: string }>(current: T[], itemId: string) {
  return current.filter((currentItem) => currentItem.id !== itemId);
}

export function removeId(currentIds: string[], id: string) {
  return currentIds.filter((currentId) => currentId !== id);
}

export function toggleId(currentIds: string[], id: string) {
  return currentIds.includes(id) ? removeId(currentIds, id) : [...currentIds, id];
}

export function pickCurrentOrFirstId<T extends { id: string }>(items: T[], currentId: string | null) {
  return currentId && items.some((item) => item.id === currentId) ? currentId : items[0]?.id ?? null;
}

export function pickCurrentOrFirstItem<T extends { id: string }>(items: T[], currentId: string | null) {
  const nextId = pickCurrentOrFirstId(items, currentId);
  return items.find((item) => item.id === nextId) ?? null;
}

export function reorderByDraggedId<T extends { id: string }>(items: T[], draggedId: string, targetId: string) {
  const currentIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (currentIndex < 0 || targetIndex < 0) {
    return null;
  }
  const nextItems = [...items];
  const [moved] = nextItems.splice(currentIndex, 1);
  nextItems.splice(targetIndex, 0, moved);
  return nextItems;
}

export function hasSameIdOrder<T extends { id: string }>(currentItems: T[], nextItems: T[]) {
  return currentItems.map((item) => item.id).join(",") === nextItems.map((item) => item.id).join(",");
}
