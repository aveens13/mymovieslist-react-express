const webrtc = require("wrtc");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const streams = new Map();

exports.broadcast = async (req, res) => {
  try {
    const body = req.body;
    if (!body.streamerID) {
      return res.status(400).json({
        success: false,
        error: "No streamerid provided",
      });
    }

    // Initialize the streams entry before creating the peer connection
    streams.set(body.streamerID, { peer: null, stream: null });

    const peer = new webrtc.RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    // Update the streams entry with the peer
    const streamData = streams.get(body.streamerID);
    streamData.peer = peer;

    console.log("Setting up ontrack event");
    peer.ontrack = (e) => {
      console.log("ontrack event fired");
      handleTrackEvent(e, peer, body.streamerID);
    };

    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    const updatedStreamData = streams.get(body.streamerID);
    console.log("Final streamData before responding:", updatedStreamData);

    if (!updatedStreamData || !updatedStreamData.stream) {
      console.log("Warning: Stream not set before responding");
    }

    const payLoad = {
      sdp: peer.localDescription,
    };

    res.status(200).json({
      success: true,
      result: payLoad,
    });
  } catch (error) {
    console.log("This error", error.message);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

function handleTrackEvent(e, peer, streamerID) {
  console.log(`Received track event for streamer ${streamerID}`);
  console.log("Event object:", e);
  console.log("Streams in event:", e.streams);

  const streamData = streams.get(streamerID);
  console.log("Current streamData:", streamData);

  if (streamData) {
    if (e.streams && e.streams.length > 0) {
      streamData.stream = e.streams[0];
      console.log(`Updated stream for streamer ${streamerID}`);
      console.log("New streamData:", streamData);
    } else {
      console.log("No streams in the track event");
    }
  } else {
    console.log(`No streamData found for streamer ${streamerID}`);
    // If streamData doesn't exist, create it
    streams.set(streamerID, { peer: null, stream: e.streams[0] });
    console.log(`Created new streamData for streamer ${streamerID}`);
  }
}

// New function to get a list of active streams
exports.getActiveStreams = async (req, res) => {
  const activeStreams = Array.from(streams.keys());
  let activeStreamerInfo = [];
  if (activeStreams.length > 0) {
    activeStreamerInfo = await Promise.all(
      activeStreams.map(async (streamer) => {
        const user = await prisma.user.findUnique({
          where: {
            user_id: streamer,
          },
          select: {
            user_id: true,
            name: true,
          },
        });
        return user;
      })
    );
  }
  res.status(200).json({
    success: true,
    streams: activeStreamerInfo,
  });
};

//Function to end broadcast
exports.endBroadcast = async (req, res) => {
  try {
    const { streamerID } = req.body;

    if (!streamerID) {
      return res.status(400).json({
        success: false,
        error: "No streamerID provided",
      });
    }

    // Check if the stream exists
    if (streams.has(streamerID)) {
      // Get the stream data
      const streamData = streams.get(streamerID);

      // Close the peer connection if it exists
      if (streamData.peer) {
        streamData.peer.close();
      }

      // Remove the stream from the map
      streams.delete(streamerID);

      console.log(`Broadcast ended for streamer ${streamerID}`);

      res.status(200).json({
        success: true,
        message: "Broadcast ended successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No active broadcast found for this streamer",
      });
    }
  } catch (error) {
    console.error("Error ending broadcast:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.consume = async (req, res) => {
  try {
    const body = req.body;
    console.log("Received consume request for streamerID:", body.streamerID);
    console.log("Available streams:", Array.from(streams.keys()));
    const streamData = streams.get(body.streamerID);

    console.log(streamData);
    if (!streamData || !streamData.stream) {
      console.log(
        "Stream not found or not ready for streamerID:",
        body.streamerID
      );
      return res
        .status(404)
        .json({ success: false, result: "Stream not found" });
    }

    const peer = new webrtc.RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    streamData.stream
      .getTracks()
      .forEach((track) => peer.addTrack(track, streamData.stream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payLoad = {
      sdp: peer.localDescription,
    };
    res.status(200).json({
      success: true,
      result: payLoad,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      result: error.message,
    });
  }
};
