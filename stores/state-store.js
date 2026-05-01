import { defineStore } from "pinia";

export const useTrackerStateStore = defineStore("default-state", {
  state: () => ({
    trackerState: {},
    trackerInfo: {},
    subscription: null,
    name: null,
  }),
  actions: {
    init(item, current) {
      if (!this.trackerState[item]) {
        this.update(item, current);
      }
    },

    update(item, current) {
      this.trackerState[item] = current;

      if (this.subscription) {
        this.subscription(this.trackerState);
      }
    },

    get(item) {
      return this.trackerState[item];
    },

    setName(name) {
      this.name = name;
    },

    subscribe(callback) {
      this.subscription = callback;
    },

    unsubscribe() {
      this.subscription = null;
    },

    getState() {
      return Object.keys(this.trackerInfo).reduce((acc, key) => {
        acc[key] = {
          ...this.trackerInfo[key],
          state: this.trackerState[key],
        };
        return acc;
      }, {});
    },
  },
});
