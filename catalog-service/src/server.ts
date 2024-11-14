import expressApp from "./expressApp";

const PORT = process.env.port || 8000;
export const StartServer = async () => {
  expressApp.listen(PORT, () => {
    console.log("Listening to: ", PORT);
  });

  process.on("uncaughtException", async (err) => {
    console.error(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log("server is up");
});
