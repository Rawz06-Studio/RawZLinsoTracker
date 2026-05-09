import { useListenKey } from "~/hooks/useListenKey.js";

export default function useOpenSmallWindow(w, h) {
  const openInSmallWindow = () => {
    const url = window.location.href + "?isSmallWindow=true";
    const width = w ?? 600;
    const height = h ?? 400;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;
    window.open(
      url,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes`,
    );
  };

  useListenKey(false, true, "l", openInSmallWindow);
}
