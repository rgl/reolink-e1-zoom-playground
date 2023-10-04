import React, { useState, useEffect, useRef } from 'react';
import { WHEPClient } from 'whip-whep/whep';

// TODO this is still broken due to https://github.com/bluenviron/mediamtx/pull/2453
// see https://react.dev/learn/synchronizing-with-effects
// see https://react.dev/learn/synchronizing-with-effects#controlling-non-react-widgets
// see https://react.dev/learn/manipulating-the-dom-with-refs
// see https://react.dev/learn/conditional-rendering
// see https://react.dev/learn/responding-to-events
// see https://react.dev/learn/state-a-components-memory
// see https://github.com/medooze/whip-whep-js
// see https://www.npmjs.com/package/whip-whep
// see https://github.com/bluenviron/mediamtx/discussions/2416
// see https://github.com/bluenviron/mediamtx/discussions/2424
// see https://github.com/medooze/whip-whep-js/issues/13
class PatchedWHEPClient extends WHEPClient {
    async trickle() {
        try {
            await super.trickle();
        } catch (error) {
            // TODO ignoring the error feels odd.
            console.error('whep error: An error occurred in the trickle method:', error);
        }
    }
}
export function CameraWhepVideoPlayer() {
    const ref = useRef(null);
    useEffect(() => {
        const videoEl = ref.current;
        const pc = new RTCPeerConnection();
        pc.addTransceiver("audio");
        pc.addTransceiver("video");
        // TODO use addEventListener instead?
        pc.ontrack = (event) => {
            console.log("whep: track available");
            if (event.track.kind == "video") {
                videoEl.srcObject = event.streams[0];
            }
        };
        function onVideoPlaying(event) {
            console.log(`whep: video resolution ${videoEl.videoWidth}x${videoEl.videoHeight}`);
        }
        videoEl.addEventListener("playing", onVideoPlaying);
        console.log('whep: creating the video player...');
        const url = 'http://localhost:8889/camera_sub/whep';
        const whep = new PatchedWHEPClient();
        whep.view(pc, url, null).catch(err => {
            // TODO retry. recreating the whole shebang.
            console.error("whep error:", err);
        });
        return async () => {
            console.log('whep: destroying the video player...');
            videoEl.removeEventListener("playing", onVideoPlaying);
            // XXX this throws because mediamtx does not allow the use of the DELETE method.
            //     see https://github.com/bluenviron/mediamtx/pull/2453
            await whep.stop();
        };
    }, []);
    return (
        <div>
            <video ref={ref} autoPlay playsInline />
        </div>
    );
}
