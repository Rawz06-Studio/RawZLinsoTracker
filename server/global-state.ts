class GlobalState {
  private _groupTrackers: Record<string, any> = {};
  private _creatingDate: Record<string, Date> = {};
  private _nameTrackers: Record<string, string | null> = {};

  private static NUMBER_MAX = 1000 as const;

  set(groupId: string, name: string | null, tracker: any) {
    if (this._groupTrackers[groupId]) {
      this._groupTrackers[groupId] = tracker;
      this._nameTrackers[groupId] = name;
    } else if (
      Object.keys(this._groupTrackers).length <= GlobalState.NUMBER_MAX
    ) {
      this._groupTrackers[groupId] = tracker;
      this._nameTrackers[groupId] = name;
      this._creatingDate[groupId] = new Date();
    } else {
      throw new Error(`Exceed number of tracker`);
    }
  }

  get(groupId: string): any {
    return this._groupTrackers[groupId];
  }

  getName(groupId: string): any {
    return this._nameTrackers[groupId];
  }

  delete(groupId: string): any {
    delete this._groupTrackers[groupId];
    delete this._creatingDate[groupId];
  }

  list() {
    return this._creatingDate;
  }

  names() {
    return this._nameTrackers;
  }
}

export const globalState = new GlobalState();
