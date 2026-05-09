import { globalState } from "~/server/global-state";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 404,
      statusMessage: `Id not specified`,
    });
  }

  if (!globalState.list()[id]) {
    throw createError({
      statusCode: 404,
      statusMessage: `Tracker with ID ${id} not found`,
    });
  }

  globalState.delete(id);

  return {
    status: "success",
    message: `Tracker with ID ${id} has been deleted`,
  };
});
