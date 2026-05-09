import { computed } from "vue";

export const useTrackerItemFunction = () => {
  const sheet = computed(() => {
    return (item) =>
      item
        ? {
            row: item.SheetInformation.row,
            column: item.SheetInformation.column,
            name: item.SheetInformation.SpriteSheet,
          }
        : {};
  });

  const position = computed(() => {
    return (item) => item?.Positions;
  });

  const name = computed(() => {
    return (item) => item?.Name;
  });

  const disabledOpacity = computed(() => {
    return (item) => item?.OpacityDisable;
  });

  const itemType = computed(() => {
    return (item) => item?.Kind;
  });

  const defaultActive = computed(() => {
    return (item) => item?.isActive;
  });

  const increments = computed(() => {
    return (item) => item.Increment;
  });

  const next = computed(() => {
    return (item) => item.NextItems;
  });

  const label = computed(() => {
    return (item) => item.Label;
  });

  return {
    sheet,
    position,
    name,
    itemType,
    disabledOpacity,
    defaultActive,
    increments,
    next,
    label,
  };
};
