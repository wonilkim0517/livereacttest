import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Hls from 'hls.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LivePage.css';

const LivePage = () => {
    const [matchId, setMatchId] = useState(1);
    const [streamStatus, setStreamStatus] = useState('stopped');
    const [error, setError] = useState(null);
    const [activeStreams, setActiveStreams] = useState({});
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const stompClientRef = useRef(null);

    const [liveStream, setLiveStream] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [chatUser, setChatUser] = useState(null);

    useEffect(() => {
        console.log("Component mounted, video element:", videoRef.current);

        // WebSocket 연결 설정
        const socket = new SockJS('https://kim11.shop:8080/ws-stomp');
        const stompClient = Stomp.over(() => socket);

        stompClient.connect({}, () => {
            console.log('WebSocket Connected');
            stompClient.subscribe('/topic/stream-events', (message) => {
                const [event, eventMatchId] = message.body.split(':');
                handleStreamEvent(event, eventMatchId);
            });
        });

        stompClientRef.current = stompClient;

        return () => {
            if (hlsRef.current) {
                console.log("Destroying HLS instance");
                hlsRef.current.destroy();
            }
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const filename = 'example'; // 실제 파일 이름으로 교체해야 합니다

        // 비디오 스트림 가져오기
        fetch(`https://kim11.shop/api/video/stream/${filename}`)
            .then(response => response.json())
            .then(data => setLiveStream(data))
            .catch(error => console.error('Error fetching live stream:', error));

        // 채팅방 생성
        fetch('https://kim11.shop/api/chat/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomName: 'Live Chat Room' })
        })
            .then(response => response.json())
            .then(data => console.log('Chat room created:', data))
            .catch(error => console.error('Error creating chat room:', error));

        // 채팅 사용자 정보 조회
        fetch('https://kim11.shop/api/chat/user')
            .then(response => response.json())
            .then(data => setChatUser(data))
            .catch(error => console.error('Error fetching chat user:', error));

        // 채팅 메시지 가져오기
        fetch('https://kim11.shop/api/comments')
            .then(response => response.json())
            .then(data => setComments(data))
            .catch(error => console.error('Error fetching comments:', error));
    }, []);

    const handleStreamEvent = (event, eventMatchId) => {
        console.log(`Received stream event: ${event} for match ${eventMatchId}`);
        if (event === 'START') {
            setActiveStreams(prev => ({ ...prev, [eventMatchId]: true }));
        } else if (event === 'STOP') {
            setActiveStreams(prev => {
                const newState = { ...prev };
                delete newState[eventMatchId];
                return newState;
            });
        }
    };

    const startWebcamStream = async () => {
        try {
            console.log("Starting webcam stream for match ID:", matchId);
            await axios.post(`https://kim11.shop/api/live/webcam/start/${matchId}`);
            setStreamStatus('active');
            console.log("Webcam stream started, loading HLS stream...");
            loadHlsStream();
        } catch (error) {
            console.error('Error starting webcam stream:', error);
            setError('Failed to start webcam stream: ' + error.message);
        }
    };

    const stopWebcamStream = async () => {
        try {
            console.log("Stopping webcam stream for match ID:", matchId);
            await axios.post(`https://kim11.shop/api/live/webcam/stop/${matchId}`);
            setStreamStatus('stopped');
            if (hlsRef.current) {
                console.log("Destroying HLS instance");
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            console.log("Webcam stream stopped");
        } catch (error) {
            console.error('Error stopping webcam stream:', error);
            setError('Failed to stop webcam stream: ' + error.message);
        }
    };

    const loadHlsStream = () => {
        const streamUrl = `https://kim11.shop/hls/${matchId}_playlist.m3u8`;
        console.log("Loading HLS stream from URL:", streamUrl);

        if (Hls.isSupported()) {
            console.log("HLS is supported, creating new Hls instance");
            const hls = new Hls({
                debug: true,
                enableWorker: true,
                lowLatencyMode: true,
            });
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
            hlsRef.current = hls;
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
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const updatedComments = [...comments, { text: newComment }];
            setComments(updatedComments);
            setNewComment('');

            fetch('https://kim11.shop/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            }).catch(error => console.error('Error posting comment:', error));
        }
    };

    return (
        <div className="live-page">
            <Header />
            <div className="live-container">
                {streamStatus === 'active' ? (
                    <div className="live-video">
                        <video ref={videoRef} controls style={{ width: '100%' }} />
                        <div className="live-status">LIVE (Webcam)</div>
                    </div>
                ) : (
                    <p>Webcam stream is not active</p>
                )}
                {error && <p className="error-message">{error}</p>}
                <div className="stream-controls">
                    <button onClick={startWebcamStream} disabled={streamStatus === 'active'}>Start Webcam Stream</button>
                    <button onClick={stopWebcamStream} disabled={streamStatus === 'stopped'}>Stop Webcam Stream</button>
                </div>
                <div className="active-streams">
                    <h3>Active Streams:</h3>
                    {Object.keys(activeStreams).map(streamMatchId => (
                        <div key={streamMatchId}>Match ID: {streamMatchId}</div>
                    ))}
                </div>
                {liveStream ? (
                    <div className="live-video">
                        <video src={liveStream.url} controls autoPlay />
                        <div className="live-status">LIVE</div>
                    </div>
                ) : (
                    <p>Loading live stream...</p>
                )}
            </div>
            <div className="comments-section">
                <h3>주요 채팅</h3>
                {chatUser && <div className="chat-user">사용자: {chatUser.username}</div>}
                <div className="comments">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <span className="comment-user-icon">👤</span>
                            <span className="comment-text">{comment.text}</span>
                        </div>
                    ))}
                </div>
                <div className="comment-input-section">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="채팅을 입력해 주세요 (최대 300자)"
                        maxLength="300"
                    />
                    <button onClick={handleCommentSubmit} className="comment-submit-button">✈️</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LivePage;
