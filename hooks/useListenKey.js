import { onMounted, onUnmounted } from "vue";

export function useListenKey(shift, control, letter, callback) {
  const handleKeyDown = (event) => {
    const isShiftValid = shift ? event.shiftKey : !event.shiftKey;
    const isControlValid = control ? event.ctrlKey : !event.ctrlKey;
    const isLetterValid = event.key.toLowerCase() === letter.toLowerCase();

    if (isShiftValid && isControlValid && isLetterValid) {
      event.preventDefault();
      callback(event);
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
}
