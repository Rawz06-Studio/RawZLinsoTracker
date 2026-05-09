import { socket } from "~/utils/socket.ts";
import { useTrackerStateStore } from "~/stores/state-store.js";

export function useSocket(id, onErrorHandle) {
  const isConnected = ref(false);
  const stateStore = useTrackerStateStore();
  const isSync = ref(false);

  // Se connecter automatiquement au groupe via l'ID
  if (socket.connected) {
    isConnected.value = true;
    const name = stateStore.name;
    socket.emit("joinGroup", { id: id.toLocaleLowerCase(), name });
  }

  function onConnect() {
    isConnected.value = true;
    const name = stateStore.name;
    socket.emit("joinGroup", { id: id.toLocaleLowerCase(), name });

    // Synchroniser le stateStore avec le serveur
    stateStore.subscribe((tracker) => {
      const name = stateStore.name;
      if (isSync.value) {
        socket.emit("tracker", { id: id.toLocaleLowerCase(), name, tracker });
      }
    });
  }

  function onDisconnect() {
    isConnected.value = false;
    stateStore.unsubscribe();
    isSync.value = false;
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  socket.on("tracker", (arg) => {
    isSync.value = true;
    if (arg.id.toLocaleLowerCase() === id.toLocaleLowerCase() && arg.tracker) {
      stateStore.trackerState = arg.tracker;
      stateStore.trackerName = arg.name;
    } else if (arg.id.toLocaleLowerCase() === id.toLocaleLowerCase()) {
      const name = stateStore.name;
      socket.emit("tracker", {
        id: id.toLocaleLowerCase(),
        name,
        tracker: stateStore.trackerState,
      });
    }
  });

  socket.on("error", () => {
    onErrorHandle("error");
  });

  socket.on("name-error", () => {
    onErrorHandle("name");
  });

  // Nettoyer les listeners lors du démontage
  onBeforeUnmount(() => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("tracker");
  });

  return { isConnected };
}
