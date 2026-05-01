import { computed } from "vue";

export const useTrackerCheckItem = (item) => {
  const sheet = computed(() => {
    return item
      ? {
          row: item.CheckImageSheetInformation.row,
          column: item.CheckImageSheetInformation.column,
          name: item.CheckImageSheetInformation.SpriteSheet,
        }
      : {};
  });

  return { sheet };
};
