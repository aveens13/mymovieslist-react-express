const mediasoup = require("mediasoup");

const { config } = require("../config");

const worker = [];

let nextMediasoupWorkerIdx = 0;

exports.createWorker = async () => {
  const worker = await mediasoup.createWorker({
    logLevel: config.mediasoup.worker.logLevel,
    logTags: config.mediasoup.worker.logTags,
    rtcMinPort: config.mediasoup.worker.rtcMinPort,
    rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
  });

  worker.on("died", () => {
    console.error(
      "Mediasoup worker died, exiting in 2 seconds...[pid&id]",
      worker.pid
    );
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  });

  const mediaCodecs = config.mediasoup.router.mediaCodes;
  const mediaSoupRouter = await worker.createRouter({ mediaCodecs });
  return mediaSoupRouter;
};
