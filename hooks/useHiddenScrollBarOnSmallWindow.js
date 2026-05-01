import { watchEffect } from "vue";

export function useHiddenScrollBarOnSmallWindow(isSmallWindow) {
  onMounted(() => {
    watchEffect(() => {
      const htmlElement = document.documentElement;

      if (isSmallWindow) {
        htmlElement.style.setProperty("scrollbar-width", "none");
        htmlElement.style.setProperty("overflow", "hidden");
      } else {
        htmlElement.style.removeProperty("scrollbar-width");
        htmlElement.style.removeProperty("overflow");
      }
    });
  });
}
