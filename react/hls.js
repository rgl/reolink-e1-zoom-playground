import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

// see https://react.dev/learn/synchronizing-with-effects
// see https://react.dev/learn/synchronizing-with-effects#controlling-non-react-widgets
// see https://react.dev/learn/manipulating-the-dom-with-refs
// see https://react.dev/learn/conditional-rendering
// see https://react.dev/learn/responding-to-events
// see https://react.dev/learn/state-a-components-memory
// see https://github.com/video-dev/hls.js#using-hlsjs
// see https://github.com/video-dev/hls.js/blob/v1.4.12/docs/API.md
export function CameraHlsVideoPlayer() {
    const ref = useRef(null);
    useEffect(() => {
        if (!Hls.isSupported()) {
            console.log("hls: fatal error, your browser is not supported");
            return;
        }
        const videoEl = ref.current;
        function onVideoPlaying(event) {
            console.log(`hls: video resolution ${videoEl.videoWidth}x${videoEl.videoHeight}`);
        }
        videoEl.addEventListener("playing", onVideoPlaying);
        console.log('hls: creating the video player...');
        var player = new Hls();
        player.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log('hls: media element attached');
        });
        player.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('hls: manifest parsed');
            videoEl.play();
        });
        player.on(Hls.Events.DESTROYING, () => {
            console.log('hls: destroying');
        });
        player.on(Hls.Events.ERROR, (event, data) => {
            if (!data.fatal) {
                return;
            }
            // TODO trickle these errors to the UI.
            switch (data.type) {
                case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('hls: fatal media error encountered, try to recover');
                    player.recoverMediaError();
                    break;
                case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error('hls: fatal network error encountered', data);
                    // All retries and media options have been exhausted.
                    // Immediately trying to restart loading could cause loop loading.
                    // Consider modifying loading policies to best fit your asset and network
                    // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
                    // TODO: retry connecting to the network.
                    break;
                default:
                    // cannot recover.
                    console.error('hls: fatal error encountered', data);
                    player.destroy();
                    // TODO: retry creating the hls player.
                    break;
            }
        });
        player.loadSource('http://localhost:8888/camera_sub/stream.m3u8');
        player.attachMedia(videoEl);
        return () => {
            console.log('hls: destroying the video player...');
            videoEl.removeEventListener("playing", onVideoPlaying);
            player.destroy();
        };
    }, []);
    return (
        <div>
            <video ref={ref} autoPlay playsInline />
        </div>
    );
}
