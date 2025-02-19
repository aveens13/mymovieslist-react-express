const { createWebRtcTransport } = require("./webrtctransport");
const { createWorker } = require("./worker");

let mediasoupRouter;
let producerTransport;
let producer;
let consumerTransport;
let consumer;

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
        case "createConsumerTransport":
          onCreateConsumerTransport(event, ws);
          break;
        case "connectConsumerTransport":
          onConnectConsumerTransport(event, ws);
          break;
        case "resume":
          onResume(ws);
          break;
        case "consume":
          onConsume(event, ws);
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

const onConsume = async (event, ws) => {
  const res = await createConsumer(producer, event.rtpCapabilities);
  send(ws, "subscribed", res);
};
const onResume = async (ws) => {
  await consumer.resume();
  send(ws, "resumed", "resumed");
};
const onConnectConsumerTransport = async (event, ws) => {
  dtlsParameters = event.dtlsParameters;
  await consumerTransport.connect({ dtlsParameters });
  send(ws, "subConnected", "consumer transport connected");
};
const onCreateConsumerTransport = async (event, ws) => {
  try {
    const { transport, params } = await createWebRtcTransport(mediasoupRouter);
    consumerTransport = transport;
    send(ws, "subTransportCreated", params);
  } catch (error) {}
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
  dtlsParameters = event.dtlsParameters;
  console.log(dtlsParameters);
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

const createConsumer = async (producer, rtpCapabilities) => {
  if (
    !mediasoupRouter.canConsume({
      producerId: producer.id,
      rtpCapabilities,
    })
  ) {
    console.error("Cannot Consume");
    return;
  }

  try {
    consumer = await consumerTransport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: producer.kind === "video",
    });
  } catch (error) {
    console.error("Consume Failed: ", error);
    return;
  }

  return {
    producerId: producer.id,
    id: consumer.id,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
    producerPaused: consumer.producerPaused,
  };
};
