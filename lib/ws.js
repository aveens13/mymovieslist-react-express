const { createWorker } = require("./worker");

let mediasoupRouter;
exports.WebsocketConnection = async (websock) => {
  try {
    mediasoupRouter = await createWorker();
  } catch (error) {
    throw error;
  }
  websock.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log("Message:", message);
      ws.send("Hello World!");
    });
  });
};
