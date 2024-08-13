import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const LiveHlsPlayer = () => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const streamUrl = "http://localhost/hls/1_playlist.m3u8";
        console.log("Loading HLS stream from URL:", streamUrl);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS manifest parsed, attempting to play");
                videoRef.current.play().then(() => {
                    console.log("Playback started successfully");
                }).catch(e => {
                    console.error("Error playing video:", e);
                    setError(`Failed to start playback: ${e.message}`);
                });
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", event, data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            setError(`Network error: ${data.details}`);
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setError(`Media error: ${data.details}`);
                            break;
                        default:
                            setError(`Fatal error: ${data.details}`);
                            break;
                    }
                }
            });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            console.log("Native HLS support detected, using video src directly");
            videoRef.current.src = streamUrl;
            videoRef.current.addEventListener('loadedmetadata', () => {
                console.log("Metadata loaded, starting video playback...");
                videoRef.current.play().then(() => {
                    console.log("Playback started successfully");
                }).catch(e => {
                    console.error("Error playing video:", e);
                    setError(`Failed to start playback: ${e.message}`);
                });
            });
        } else {
            console.error("HLS is not supported in this browser and no fallback available.");
            setError("This browser does not support HLS streaming. Please try a different browser.");
        }
    }, []);

    return (
        <div className="live-hls-player">
            <video ref={videoRef} controls style={{ width: '100%' }} />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LiveHlsPlayer;
