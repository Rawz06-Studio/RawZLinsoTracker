export interface TrackerMeta {
  createdAt: Date;
  lastActivityAt: Date;
}

class GlobalState {
  private _groupTrackers: Record<string, any> = {};
  private _trackerMeta: Record<string, TrackerMeta> = {};
  private _nameTrackers: Record<string, string | null> = {};

  private static NUMBER_MAX = 1000 as const;

  set(groupId: string, name: string | null, tracker: any) {
    const now = new Date();
    if (this._groupTrackers[groupId] !== undefined) {
      this._groupTrackers[groupId] = tracker;
      this._nameTrackers[groupId] = name;
      this._trackerMeta[groupId].lastActivityAt = now;
    } else if (
      Object.keys(this._groupTrackers).length <= GlobalState.NUMBER_MAX
    ) {
      this._groupTrackers[groupId] = tracker;
      this._nameTrackers[groupId] = name;
      this._trackerMeta[groupId] = { createdAt: now, lastActivityAt: now };
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

  getMeta(groupId: string): TrackerMeta | undefined {
    return this._trackerMeta[groupId];
  }

  touchActivity(groupId: string) {
    if (this._trackerMeta[groupId]) {
      this._trackerMeta[groupId].lastActivityAt = new Date();
    }
  }

  delete(groupId: string): any {
    delete this._groupTrackers[groupId];
    delete this._trackerMeta[groupId];
    delete this._nameTrackers[groupId];
  }

  list(): Record<string, TrackerMeta> {
    return this._trackerMeta;
  }

  names() {
    return this._nameTrackers;
  }
}

export const globalState = new GlobalState();
