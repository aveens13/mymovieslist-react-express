const { createWebRtcTransport } = require("./webrtctransport");
const { createWorker } = require("./worker");

let mediasoupRouter;
let producerTransport;
let producer;

exports.WebsocketConnection = async (websock) => {
  try {
    mediasoupRouter = await createWorker();
  } catch (error) {
    throw error;
  }
  websock.on("connection", (ws) => {
    ws.on("message", (message) => {
      const jsonValidation = IsJsonString(message);
      if (!jsonValidation) {
        console.error("Json error");
        return;
      }
      const event = JSON.parse(message);
      switch (event.type) {
        case "getRouterRtpCapabilities":
          onRouterRtpCapabilities(event, ws);
          break;
        case "createProducerTransport":
          onCreateProducerTransport(event, ws);
          break;
        case "connectProducerTransport":
          onConnectProducerTransport(event, ws);
          break;
        case "produce":
          onProduce(event, ws, websock);
          break;
        default:
          break;
      }
    });
  });
};

const IsJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
};

const onProduce = async (event, ws, websocket) => {
  const { kind, rtpParameters } = event;
  producer = await producerTransport.produce({ kind, rtpParameters });
  const resp = {
    id: producer.id,
  };
  send(ws, "produced", resp);
  broadcast(websocket, "newProducer", "new user");
};

const onConnectProducerTransport = async (event, ws) => {
  await producerTransport.connect({ dtlsParameters });
  send(ws, "producerConnected", "producer connected!");
};

const onRouterRtpCapabilities = (event, ws) => {
  send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities);
};

const onCreateProducerTransport = async (event, ws) => {
  try {
    const { transport, params } = await createWebRtcTransport(mediasoupRouter);
    producerTransport = transport;
    send(ws, "producerTransportCreated", params);
  } catch (error) {
    console.error(error);
    send(ws, "error", error);
  }
};

const send = (ws, type, msg) => {
  const message = {
    type,
    data: msg,
  };

  const resp = JSON.stringify(message);
  ws.send(resp);
};

const broadcast = (ws, type, msg) => {
  const message = {
    type,
    data: msg,
  };

  const resp = JSON.stringify(message);
  ws.clients.forEach((client) => {
    client.send(resp);
  });
};
