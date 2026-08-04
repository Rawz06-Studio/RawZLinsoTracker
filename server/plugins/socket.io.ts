import { Server as Engine } from "engine.io";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { globalState } from "~/server/global-state";

const HOUR_AVAILABLE = 12 as const;

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket: Socket) => {
    socket.on("joinGroup", (args: { id: string; name: string }) => {
      const groupId = args.id.toLocaleLowerCase();
      socket.join(groupId);

      if (globalState.get(groupId) !== undefined) {
        const name = globalState.getName(groupId);
        globalState.touchActivity(groupId);
        console.info(
          `[socket] User ${socket.id} connected to tracker "${groupId}"`,
        );
        if (args.name === name) {
          socket.emit("tracker", {
            id: groupId,
            name,
            tracker: globalState.get(groupId),
          });
        } else {
          socket.emit("name-error", name);
        }
      } else {
        try {
          const name = args.name;
          globalState.set(groupId, null, null);
          console.info(`[socket] New tracker created: "${groupId}"`);
          console.info(
            `[socket] User ${socket.id} connected to tracker "${groupId}"`,
          );
          socket.emit("tracker", {
            id: groupId,
            name,
            tracker: globalState.get(groupId),
          });
          setTimeout(
            () => {
              globalState.delete(groupId);
            },
            HOUR_AVAILABLE * 60 * 60 * 1000,
          );
        } catch (e) {
          console.error(
            `[socket] Error creating tracker "${groupId}":`,
            (e as Error).message,
          );
          socket.emit("error", e);
        }
      }
    });

    socket.on("tracker", (data: { id: string; name: string; tracker: any }) => {
      const { id, tracker, name } = data;
      if (!id) {
        console.error("[socket] Tracker update received without ID");
        return;
      }

      try {
        globalState.set(id, name, tracker);
        console.info(`[socket] Tracker "${id}" updated by user ${socket.id}`);

        io.to(id).emit("tracker", { id, tracker });
      } catch (e) {
        console.error(
          `[socket] Error updating tracker "${id}":`,
          (e as Error).message,
        );
        socket.emit("error", e);
      }
    });

    socket.on("disconnect", (reason) => {
      const rooms = [...socket.rooms].filter((r) => r !== socket.id);
      for (const groupId of rooms) {
        globalState.touchActivity(groupId);
      }
      console.info(
        `[socket] User ${socket.id} disconnected (reason: ${reason})`,
      );
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler((event) => {
      const { req, res } = event.node;
      engine.handleRequest(req as any, res);
      event._handled = true;
    }),
  );

  // Expose the io instance for use in API handlers
  (nitroApp as any)._io = io;
});
