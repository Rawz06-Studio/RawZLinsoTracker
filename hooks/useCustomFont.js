import { onMounted, watch, ref, watchEffect } from "vue";

export function useCustomFont(tracker, fontName, fontFileName) {
  const fontFile = ref(`sources/${tracker}/${fontFileName}`);

  function loadFont(fontName, fontFile) {
    const fontFace = new FontFace(
      fontName,
      `url(/${fontFile}) format('truetype')`,
    );
    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
      })
      .catch((error) => {
        console.error(`Failed to load font ${fontName}:`, error);
      });
  }

  onMounted(() => {
    loadFont(fontName, fontFile.value);
  });

  // Mettre à jour la police si fontName change
  watch(
    () => fontName,
    (newFontName) => {
      fontFile.value = `sources/${tracker}/${newFontName}`;
      loadFont(newFontName, fontFile.value);
    },
  );

  watchEffect(() => {
    document.documentElement.style.setProperty(
      "--font-" + fontName.value,
      fontName.value,
    );
  });
}

export function useDefaultFont() {
  const fontFile = ref(`default/ViceCitySans.otf`);

  function loadFont(fontName, fontFile) {
    const fontFace = new FontFace(
      "fontName",
      `url(/${fontFile}) format('truetype')`,
    );
    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
      })
      .catch((error) => {
        console.error(`Failed to load font ${fontName}:`, error);
      });
  }

  onMounted(() => {
    loadFont("ViceCitySans", fontFile.value);
    document.documentElement.style.setProperty(
      "--font-vice-city-sans",
      "ViceCitySans",
    );
  });
}
