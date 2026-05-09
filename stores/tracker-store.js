import { defineStore } from "pinia";
import { convertRgb } from "~/utils/convertRgbToHex.js";

export const useTrackerStore = defineStore("tracker", {
  state: () => ({
    data: null,
    trackerName: null,
  }),
  actions: {
    async load(trackerName) {
      if (trackerName.endsWith("disabled")) {
        return new Promise((_, reject) => reject(false));
      }
      return fetch("/sources/" + trackerName + "/tracker.json")
        .then(async (res) => {
          try {
            this.data = await res.json();
            this.trackerName = trackerName;
            return true;
          } catch {
            return false;
          }
        })
        .catch(() => false);
    },

    dimensions() {
      return this.data ? this.data[1].Datas.Dimensions : null;
    },

    background() {
      return this.data
        ? "/sources/" + this.trackerName + "/" + this.data[1].Datas.Background
        : null;
    },

    backgroundColor() {
      return this.data ? convertRgb(this.data[1].Datas.BackgroundColor) : null;
    },

    items() {
      return this.data ? this.data[3].Items : null;
    },

    itemSheetDimensions(type) {
      return this.data
        ? this.data[1].Datas.Items[type].ItemsSheetDimensions
        : null;
    },

    itemSheetImage(type) {
      return this.data
        ? "/sources/" +
            this.trackerName +
            "/" +
            this.data[1].Datas.Items[type].ItemsSheet
        : null;
    },

    fonts() {
      return Object.entries(this.data[2].Fonts).map(([key, value]) => {
        return {
          name: key,
          filename: value.Name,
          colors: [
            convertRgb(value.Colors.Normal),
            convertRgb(value.Colors.Max),
          ],
        };
      });
    },
  },
});
