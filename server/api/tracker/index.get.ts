import { globalState } from "~/server/global-state";
import { diff } from "~/server/utils/date";
import type { Server } from "socket.io";

export default defineEventHandler(async () => {
  const nitroApp = useNitroApp();
  const io: Server | undefined = (nitroApp as any)._io;

  return Object.entries(globalState.list()).reduce(
    (acc, [key, meta]) => {
      const room = io?.sockets?.adapter?.rooms?.get(key);
      const connectedUsers = room ? room.size : 0;

      return {
        ...acc,
        [key]: {
          tracker: globalState.getName(key),
          url: "/tracker/" + globalState.getName(key) + "/" + key,
          createdAt: meta.createdAt.toISOString(),
          createdDelay: diff(meta.createdAt)
            .map((num) => String(num).padStart(2, "0"))
            .join(":"),
          connectedUsers,
          lastActivityAt: meta.lastActivityAt.toISOString(),
          lastActivityDelay: diff(meta.lastActivityAt)
            .map((num) => String(num).padStart(2, "0"))
            .join(":"),
          isActive: connectedUsers > 0,
        },
      };
    },
    {} as Record<string, any>,
  );
});
