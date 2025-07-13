import { streamText } from "hono/streaming";
import { createHandlers } from "../helpers/factory";
import {
  createAndInitializeSnapshot,
  createInstanceFromSnapshotId,
} from "../pipelines";
import { format } from "date-fns";

// Will be a background process
export const createNewSnapshot = createHandlers(async (c) => {
  const mc = c.get("mc");
  // TOOD: Check if the API key is valid

  return streamText(c, async (stream) => {
    try {
      // Create a callback function to send updates to the stream
      const streamUpdate = async (message: string) => {
        await stream.writeln(
          `[${format(new Date(), "dd:MM HH:mm")}] ${message}`
        );
      };

      // Call createSnapshot with the stream callback
      const newSnapshot = await createAndInitializeSnapshot(mc, streamUpdate);

      // Send final result
      await stream.writeln(`✅ Snapshot created successfully!`);
      await stream.writeln(`DONE: ${newSnapshot.id}`);
    } catch (error: any) {
      await stream.writeln(`ERROR: ${error.message}`);
    }
  });
});

export const createNewInstance = createHandlers(async (c) => {
  const mc = c.get("mc");
  const { snapshotId }: { snapshotId: string } = await c.req.json();

  const { serviceUrl, instance } = await createInstanceFromSnapshotId(
    mc,
    snapshotId
  );
  return c.json({
    success: true,
    data: { instanceId: instance.id, url: serviceUrl.url },
  });
});
