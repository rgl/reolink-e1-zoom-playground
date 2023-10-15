import React, { useState, useEffect, useRef } from 'react';
import { WHEPClient } from './whep-client';

// see https://react.dev/learn/synchronizing-with-effects
// see https://react.dev/learn/synchronizing-with-effects#controlling-non-react-widgets
// see https://react.dev/learn/manipulating-the-dom-with-refs
// see https://react.dev/learn/conditional-rendering
// see https://react.dev/learn/responding-to-events
// see https://react.dev/learn/state-a-components-memory
export function CameraWhepVideoPlayer() {
    const ref = useRef(null);
    useEffect(() => {
        const videoEl = ref.current;
        function onVideoPlaying(event) {
            console.log(`whep: video resolution ${videoEl.videoWidth}x${videoEl.videoHeight}`);
        }
        videoEl.addEventListener("playing", onVideoPlaying);
        console.log('whep: creating the video player...');
        const url = 'http://localhost:8889/camera_sub/whep';
        const whep = new WHEPClient(url, videoEl);
        return async () => {
            console.log('whep: destroying the video player...');
            videoEl.removeEventListener("playing", onVideoPlaying);
            whep.stop();
        };
    }, []);
    return (
        <div>
            <video ref={ref} autoPlay playsInline />
        </div>
    );
}
