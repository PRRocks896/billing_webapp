import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { Box, Typography, Button } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_BASE_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3111';
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

const GlobalChatListener = () => {
    const user = useSelector((state) => state.loggedInUser);
    const location = useLocation();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const audioRef = useRef(new Audio(NOTIFICATION_SOUND_URL));

    const locationRef = useRef(location.pathname);

    useEffect(() => {
        locationRef.current = location.pathname;
    }, [location.pathname]);

    useEffect(() => {
        if (!user || !user.id) return;

        const newSocket = io(BACKEND_URL);
        setSocket(newSocket);

        // Determine rooms to join
        const roleName = user.px_role?.name?.toLowerCase() || '';
        const roomsToJoin = [{ type: 'general', id: 'home' }];

        if (roleName === 'admin' || roleName === 'super admin') {
            if (user.px_citie?.slug) {
                roomsToJoin.push({ type: 'city', id: user.px_citie.slug });
            }
        } else if (user.slug) {
            roomsToJoin.push({ type: 'branch', id: user.slug });
        }

        newSocket.on('connect', () => {
            console.log('Global Socket Connected:', newSocket.id);
            roomsToJoin.forEach(room => {
                newSocket.emit('join_room', { type: room.type, id: room.id.toLowerCase() });
            });
        });

        const handleMessage = (data) => {
            // Only notify if NOT on the chat page
            if (locationRef.current !== '/chat' && data.sender === 'User') {
                audioRef.current.play().catch(e => console.log('Global audio blocked:', e));
                
                const roomName = data.room.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                toast.info(
                    <Box onClick={() => navigate('/chat')} sx={{ cursor: 'pointer' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            New Message ({roomName})
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 0.5 }}>
                            <strong>Customer {data.senderId.slice(0, 4)}:</strong> {data.text}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                            Click to open chat
                        </Typography>
                    </Box>,
                    {
                        position: "top-right",
                        autoClose: 6000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        icon: "💬"
                    }
                );
            }
        };

        const handleUserJoined = (data) => {
            if (locationRef.current !== '/chat' && data.userId !== newSocket.id) {
                // Determine user-friendly room name
                const roomParts = data.room.split('_');
                const roomType = roomParts[0].charAt(0).toUpperCase() + roomParts[0].slice(1);
                const roomVal = roomParts[1].charAt(0).toUpperCase() + roomParts[1].slice(1);
                const userFriendlyRoom = `${roomType}: ${roomVal}`;

                toast.info(`New customer landed on ${userFriendlyRoom}`, {
                    position: "top-right",
                    autoClose: 4000,
                    icon: "👤"
                });
            }
        };

        newSocket.on('receive_message', handleMessage);
        newSocket.on('user_joined', handleUserJoined);

        return () => {
            newSocket.disconnect();
        };
    }, [user, navigate]);

    return null; // This component doesn't render anything visible
};

export default GlobalChatListener;
