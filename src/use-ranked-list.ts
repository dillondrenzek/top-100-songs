import { useState, useCallback } from "react";

export function useRankedList<T = unknown>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);

  const promoteItem = useCallback(
    (item: T) => {
      // find item index (n)
      const currentIndex = items.indexOf(item);

      if (currentIndex === -1 || currentIndex === 0) {
        return;
      }

      const prevItem = items[currentIndex - 1];
      const currItem = items[currentIndex];

      setItems([
        ...items.slice(0, currentIndex - 1),
        currItem,
        prevItem,
        ...items.slice(currentIndex + 1),
      ]);
    },
    [items]
  );

  const demoteItem = useCallback(
    (item: T) => {
      // find item index (n)
      const currentIndex = items.indexOf(item);

      if (currentIndex === -1 || currentIndex >= items.length - 1) {
        return;
      }

      const nextItem = items[currentIndex + 1];
      const currItem = items[currentIndex];

      setItems([
        ...items.slice(0, currentIndex),
        nextItem,
        currItem,
        ...items.slice(currentIndex + 2),
      ]);
    },
    [items]
  );

  const moveItemToTop = useCallback(
    (item: T) => {
      // Identity Equality
      const foundItemIndex = items.findIndex((val) => item === val);

      if (foundItemIndex === -1) {
        return;
      }

      setItems([
        items[foundItemIndex],
        ...items.slice(0, foundItemIndex),
        ...items.slice(foundItemIndex + 1),
      ]);
    },
    [items]
  );

  const moveItemToBottom = useCallback(
    (item: T) => {
      // Identity Equality
      const foundItemIndex = items.findIndex((val) => item === val);

      if (foundItemIndex === -1) {
        return;
      }

      setItems([
        ...items.slice(0, foundItemIndex),
        ...items.slice(foundItemIndex + 1),
        items[foundItemIndex],
      ]);
    },
    [items]
  );

  const addItem = useCallback(
    (item: T) => {
      setItems([item, ...items]);
    },
    [items]
  );

  return {
    items,
    promoteItem,
    demoteItem,
    moveItemToTop,
    moveItemToBottom,
    addItem,
  };
}
