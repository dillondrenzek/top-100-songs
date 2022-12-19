export function promoteItem(arr: any[], item: any): any[] {
  // find item index (n)
  const currentIndex = arr.indexOf(item);

  if (currentIndex === -1 || currentIndex === 0) {
    return arr;
  }

  const prevItem = arr[currentIndex - 1];
  const currItem = arr[currentIndex];

  return [
    ...arr.slice(0, currentIndex - 1),
    currItem,
    prevItem,
    ...arr.slice(currentIndex + 1),
  ];
}

export function demoteItem(items: any[], item: any): any[] {
  // find item index (n)
  const currentIndex = items.indexOf(item);

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    return items;
  }

  const nextItem = items[currentIndex + 1];
  const currItem = items[currentIndex];

  return [
    ...items.slice(0, currentIndex),
    nextItem,
    currItem,
    ...items.slice(currentIndex + 2),
  ];
}

export function moveItemToTop(items: any[], item: any): any[] {
  // Identity Equality
  const foundItemIndex = items.findIndex((val) => item === val);

  if (foundItemIndex === -1 || foundItemIndex === 0) {
    return items;
  }

  return [
    items[foundItemIndex],
    ...items.slice(0, foundItemIndex),
    ...items.slice(foundItemIndex + 1),
  ];
}

export function moveItemToBottom(items: any[], item: any): any[] {
  // Identity Equality
  const foundItemIndex = items.findIndex((val) => item === val);

  if (foundItemIndex === -1) {
    return items;
  }

  return [
    ...items.slice(0, foundItemIndex),
    ...items.slice(foundItemIndex + 1),
    items[foundItemIndex],
  ];
}
