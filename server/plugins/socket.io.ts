import { Server as Engine } from "engine.io";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import {globalState} from "~/server/global-state";

const HOUR_AVAILABLE = 12 as const;

export default defineNitroPlugin((nitroApp) => {
    const engine = new Engine();
    const io = new Server();

    io.bind(engine);

    io.on("connection", (socket: Socket) => {
        console.debug("New connection :", socket.id);

        socket.on('joinGroup', (args: { id: string, name: string }) => {
            console.debug(`Client ${socket.id} a join group ${args.id.toLocaleLowerCase()}`);
            socket.join(args.id.toLocaleLowerCase());

            if (globalState.get(args.id.toLocaleLowerCase())) {
                const name = globalState.getName(args.id.toLocaleLowerCase())
                if(args.name === name) {
                    socket.emit('tracker', { id: args.id.toLocaleLowerCase(), name, tracker: globalState.get(args.id.toLocaleLowerCase()) });
                } else {
                    socket.emit('name-error', name)
                }
            } else {
                try {
                    const name = args.name
                    globalState.set(args.id.toLocaleLowerCase(), null, null);
                    socket.emit('tracker', { id: args.id.toLocaleLowerCase(), name, tracker: globalState.get(args.id.toLocaleLowerCase()) });
                    setTimeout(() => {
                        globalState.delete(args.id.toLocaleLowerCase())
                    }, HOUR_AVAILABLE * 60 * 60 * 1000);
                } catch(e) {
                    socket.emit('error', e)
                }
            }
        });

        socket.on('tracker', (data: { id: string; name: string, tracker: any }) => {
            const { id, tracker, name } = data;
            if (!id) {
                console.error("ID is missing");
                return;
            }

            try {
                globalState.set(id, name, tracker);
                console.debug(`update tracker for the group ${id}:`, tracker);

                // Diffuser la mise à jour à tous les membres du groupe
                io.to(id).emit('tracker', {id, tracker});
            } catch(e) {
                socket.emit('error', e)
            }
        });

        socket.on("disconnect", (reason) => {
            console.debug(`Disconnection of client ${socket.id} :`, reason);
        });
    });

    nitroApp.router.use("/socket.io/", defineEventHandler((event) => {
        const { req, res } = event.node;
        engine.handleRequest(req as any, res);
        event._handled = true;
    }));
});