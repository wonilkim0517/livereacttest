// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import Hls from 'hls.js';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// // import './LiveStreaming.css';
//
// const LiveStreaming = () => {
//     const [matchId, setMatchId] = useState(1);
//     const [streamStatus, setStreamStatus] = useState('stopped');
//     const [error, setError] = useState(null);
//     const videoRef = useRef(null);
//     const hlsRef = useRef(null);
//
//     useEffect(() => {
//         console.log("Component mounted, video element:", videoRef.current);
//         return () => {
//             if (hlsRef.current) {
//                 console.log("Destroying HLS instance");
//                 hlsRef.current.destroy();
//             }
//         };
//     }, []);
//
//     const startWebcamStream = async () => {
//         try {
//             console.log("Starting webcam stream for match ID:", matchId);
//             await axios.post(`http://localhost:8080/api/live/webcam/start/${matchId}`);
//             setStreamStatus('active');
//             console.log("Webcam stream started, loading HLS stream...");
//             loadHlsStream();
//         } catch (error) {
//             console.error('Error starting webcam stream:', error);
//             setError('Failed to start webcam stream: ' + error.message);
//         }
//     };
//
//     const stopWebcamStream = async () => {
//         try {
//             console.log("Stopping webcam stream for match ID:", matchId);
//             await axios.post(`http://localhost:8080/api/live/webcam/stop/${matchId}`);
//             setStreamStatus('stopped');
//             if (hlsRef.current) {
//                 console.log("Destroying HLS instance");
//                 hlsRef.current.destroy();
//                 hlsRef.current = null;
//             }
//             console.log("Webcam stream stopped");
//         } catch (error) {
//             console.error('Error stopping webcam stream:', error);
//             setError('Failed to stop webcam stream: ' + error.message);
//         }
//     };
//
//     const loadHlsStream = () => {
//         const streamUrl = `http://localhost/hls/${matchId}_playlist.m3u8`;
//         console.log("Loading HLS stream from URL:", streamUrl);
//
//         if (Hls.isSupported()) {
//             console.log("HLS is supported, creating new Hls instance");
//             const hls = new Hls({
//                 debug: true,
//                 enableWorker: true,
//                 lowLatencyMode: true,
//             });
//             hls.loadSource(streamUrl);
//             hls.attachMedia(videoRef.current);
//             hls.on(Hls.Events.MANIFEST_PARSED, () => {
//                 console.log("HLS manifest parsed, attempting to play");
//                 videoRef.current.play().then(() => {
//                     console.log("Playback started successfully");
//                 }).catch(e => {
//                     console.error("Error playing video:", e);
//                     setError(`Failed to start playback: ${e.message}`);
//                 });
//             });
//             hls.on(Hls.Events.ERROR, (event, data) => {
//                 console.error("HLS error:", event, data);
//                 if (data.fatal) {
//                     switch (data.type) {
//                         case Hls.ErrorTypes.NETWORK_ERROR:
//                             setError(`Network error: ${data.details}`);
//                             break;
//                         case Hls.ErrorTypes.MEDIA_ERROR:
//                             setError(`Media error: ${data.details}`);
//                             break;
//                         default:
//                             setError(`Fatal error: ${data.details}`);
//                             break;
//                     }
//                 }
//             });
//             hlsRef.current = hls;
//         } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
//             console.log("Native HLS support detected, using video src directly");
//             videoRef.current.src = streamUrl;
//             videoRef.current.addEventListener('loadedmetadata', () => {
//                 console.log("Metadata loaded, starting video playback...");
//                 videoRef.current.play().then(() => {
//                     console.log("Playback started successfully");
//                 }).catch(e => {
//                     console.error("Error playing video:", e);
//                     setError(`Failed to start playback: ${e.message}`);
//                 });
//             });
//         } else {
//             console.error("HLS is not supported in this browser and no fallback available.");
//             setError("This browser does not support HLS streaming. Please try a different browser.");
//         }
//     };
//
//     return (
//         <div className="live-streaming-page">
//             <Header />
//             <div className="live-container">
//                 <div className="video-section">
//                     <video ref={videoRef} controls style={{ width: '100%' }} />
//                     {streamStatus === 'active' ? (
//                         <div className="live-status">LIVE (Webcam)</div>
//                     ) : (
//                         <p>Webcam stream is not active</p>
//                     )}
//                     {error && <p className="error-message">{error}</p>}
//                 </div>
//                 <div className="stream-controls">
//                     <button onClick={startWebcamStream} disabled={streamStatus === 'active'}>Start Webcam Stream</button>
//                     <button onClick={stopWebcamStream} disabled={streamStatus === 'stopped'}>Stop Webcam Stream</button>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };
//
// export default LiveStreaming;
