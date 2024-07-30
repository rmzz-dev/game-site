import { setup } from "~/server/utils/db";

export default defineTask({
  async run() {
    await setup();
    return { result: "ok" };
  },
});
