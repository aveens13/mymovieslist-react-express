import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/broadcast.css";
export default function Broadcast({ userName, userToken }) {
  const videoRef = useRef(null);
  useEffect(() => {
    init();
  }, []);
  let { streamerId } = useParams();
  async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" });
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "0df9a5d34563a36ffade45c9",
          credential: "qpUfgv53MDLcdugm",
        },
      ],
    });

    // Add these event listeners
    peer.addEventListener("icecandidateerror", (event) => {
      console.error("ICE candidate error:", event);
      console.error("Error code:", event.errorCode);
      console.error("Error text:", event.errorText);
      console.error("Server URL:", event.url);
      console.error("Host candidate:", event.hostCandidate);
    });

    peer.addEventListener("connectionstatechange", () => {
      console.log("Connection state:", peer.connectionState);
    });

    peer.addEventListener("iceconnectionstatechange", () => {
      console.log("ICE connection state:", peer.iceConnectionState);
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  }

  async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    // await new Promise((resolve) => {
    //   if (peer.iceGatheringState === "complete") {
    //     resolve();
    //   } else {
    //     peer.addEventListener("icegatheringstatechange", () => {
    //       if (peer.iceGatheringState === "complete") {
    //         resolve();
    //       }
    //     });
    //   }
    // });
    const iceCandidates = [];
    await new Promise((resolve) => {
      const checkState = () => {
        if (peer.iceGatheringState === "complete") {
          peer.removeEventListener("icecandidate", onIceCandidate);
          resolve();
        }
      };
      const onIceCandidate = (event) => {
        if (event.candidate) {
          iceCandidates.push(event.candidate);
        }
        checkState();
      };
      peer.addEventListener("icecandidate", onIceCandidate);
      checkState();
      setTimeout(resolve, 5000); // 5 second timeout
    });

    const payload = {
      sdp: peer.localDescription,
      iceCandidates,
      streamerID: streamerId,
    };

    const response = await fetch(`/api/consume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    response.json().then((e) => {
      const desc = new RTCSessionDescription(e.result.sdp);
      peer.setRemoteDescription(desc).catch((event) => console.log(event));
      for (const candidate of e.result.iceCandidates || []) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  function handleTrackEvent(e) {
    if (videoRef.current && e.streams.length > 0) {
      console.log("videoref");
      videoRef.current.srcObject = e.streams[0];
    }
  }
  return (
    <div className="broadcast">
      <div className="title">Broadcast</div>
      <video autoPlay ref={videoRef} allowFullScreen controls></video>
    </div>
  );
}
