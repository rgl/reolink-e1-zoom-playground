import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CameraWhepVideoPlayer } from './whep';
import { CameraHlsVideoPlayer } from './hls';
import './styles.css';

function App() {
    const [showWhepVideoPlayer, setShowWhepVideoPlayer] = useState(true);
    const [showHlsVideoPlayer, setShowHlsVideoPlayer] = useState(false);
    function toggleShowWhepVideoPlayer() {
        setShowWhepVideoPlayer(!showWhepVideoPlayer);
    }
    function toggleShowHlsVideoPlayer() {
        setShowHlsVideoPlayer(!showHlsVideoPlayer);
    }
    return (
        <>
            <div className="players">
                <div>
                    <div>
                        <button onClick={toggleShowWhepVideoPlayer}>{showWhepVideoPlayer ? "Destroy" : "Create"} WHEP Video Player</button>
                    </div>
                    {showWhepVideoPlayer && <CameraWhepVideoPlayer />}
                </div>
                <div>
                    <div>
                        <button onClick={toggleShowHlsVideoPlayer}>{showHlsVideoPlayer ? "Destroy" : "Create"} HLS Video Player</button>
                    </div>
                    {showHlsVideoPlayer && <CameraHlsVideoPlayer />}
                </div>
            </div>
        </>
    );
}

createRoot(document.getElementById('app')).render(<App />);
