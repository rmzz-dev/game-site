export default defineNitroPlugin(() => {
  runTask("db:setup");
});
