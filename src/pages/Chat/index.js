import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, TextField, IconButton, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { Send as SendIcon, Person as PersonIcon, SupportAgent as SupportIcon } from '@mui/icons-material';
import io from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BASE_URL.replace(/\/api\/?$/, '');

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

const ChatPage = () => {
    const user = useSelector((state) => state.loggedInUser);
    const [conversations, setConversations] = useState({}); // { [senderId]: { messages: [], room: '', name: '', unread: 0, status: 'online' } }
    const [selectedId, setSelectedId] = useState(null);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [activeRoomKey, setActiveRoomKey] = useState(''); // The room currently being viewed
    const [availableRooms, setAvailableRooms] = useState([]); // [{type, id, label, key}]
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const audioRef = useRef(new Audio(NOTIFICATION_SOUND_URL));

    useEffect(() => {
        const newSocket = io(BACKEND_URL);
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    // 1. Initialize Rooms
    useEffect(() => {
        if (!user.id) return;

        const rooms = [{ type: 'general', id: 'home', label: 'Main Website', key: 'general_home' }];
        const roleName = user.px_role?.name?.toLowerCase();

        if (roleName === 'admin' || roleName === 'super admin') {
            if (user.px_citie?.slug) {
                rooms.push({
                    type: 'city',
                    id: user.px_citie.slug,
                    label: `City: ${user.px_citie.name}`,
                    key: `city_${user.px_citie.slug.toLowerCase()}`
                });
            }
        } else if (user.slug) {
            rooms.push({
                type: 'branch',
                id: user.slug,
                label: 'My Branch',
                key: `branch_${user.slug.toLowerCase()}`
            });
        }

        setAvailableRooms(rooms);
        // Default to branch/city room if available
        const defaultRoom = rooms.length > 1 ? rooms[1] : rooms[0];
        setActiveRoomKey(defaultRoom.key);
    }, [user]);

    // 2. Join all rooms & Listen
    useEffect(() => {
        if (!socket || availableRooms.length === 0) return;

        // Join everyone in the possible rooms
        availableRooms.forEach(r => {
            socket.emit('join_room', { type: r.type, id: r.id.toLowerCase() });
        });

        const handleUserJoined = (data) => {
            console.log('User Joined Room:', data);
            if (data.userId === socket.id) return; // Ignore self

            setConversations(prev => {
                // If this is a brand new customer landing, play a notification
                if (!prev[data.userId] && isSoundEnabled) {
                    audioRef.current.play().catch(e => console.log('Presence audio blocked:', e));
                }

                return {
                    ...prev,
                    [data.userId]: prev[data.userId] || {
                        id: data.userId,
                        name: `Customer ${data.userId.slice(0, 4)}`,
                        messages: [],
                        room: data.room,
                        unread: 0,
                        status: 'online'
                    }
                };
            });
        };

        const messageHandler = (data) => {
            console.log('Received message:', data);
            const senderId = data.senderId;
            if (!senderId || senderId === socket.id) return;

            setConversations((prev) => {
                const isCurrent = selectedId === senderId;
                const existing = prev[senderId] || {
                    messages: [],
                    name: `Customer ${senderId.slice(0, 4)}`,
                    unread: 0,
                    room: data.room // Fallback room from message payload
                };

                if (data.sender === 'User' && isSoundEnabled) {
                    audioRef.current.play().catch(e => console.log('Audio blocked:', e));
                }

                return {
                    ...prev,
                    [senderId]: {
                        ...existing,
                        lastMessage: data.text,
                        unread: (isCurrent || data.sender !== 'User') ? 0 : (existing.unread + 1),
                        messages: [...existing.messages, {
                            id: Date.now() + Math.random(),
                            text: data.text,
                            sender: data.sender === 'User' ? 'Customer' : 'Support',
                            time: data.time,
                            isCustomer: data.sender === 'User'
                        }]
                    }
                };
            });

            if (!selectedId) setSelectedId(senderId);
        };

        const handleRoomMembers = (data) => {
            console.log('Room members received:', data);
            setConversations(prev => {
                const newState = { ...prev };
                data.members.forEach(member => {
                    if (!newState[member.userId]) {
                        newState[member.userId] = {
                            id: member.userId,
                            name: `Customer ${member.userId.slice(0, 4)}`,
                            messages: [],
                            room: member.room,
                            unread: 0,
                            status: 'online'
                        };
                    } else {
                        newState[member.userId].status = 'online';
                        newState[member.userId].room = member.room;
                    }
                });
                return newState;
            });
        };

        socket.on('user_joined', handleUserJoined);
        socket.on('receive_message', messageHandler);
        socket.on('room_members', handleRoomMembers);

        return () => {
            socket.off('user_joined', handleUserJoined);
            socket.off('receive_message', messageHandler);
            socket.off('room_members', handleRoomMembers);
        };
    }, [socket, availableRooms, selectedId, isSoundEnabled]);

    useEffect(() => {
        if (selectedId && conversations[selectedId]?.unread > 0) {
            setConversations(prev => ({
                ...prev,
                [selectedId]: { ...prev[selectedId], unread: 0 }
            }));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedId, conversations]);

    const handleSend = () => {
        if (!input.trim() || !socket || !selectedId) return;

        const customer = conversations[selectedId];
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        socket.emit('send_message', {
            room: customer.room, // Dynamic room based on where customer is
            sender: 'Customer Support',
            text: input,
            time,
            targetId: selectedId
        });

        setConversations(prev => {
            const chat = prev[selectedId];
            return {
                ...prev,
                [selectedId]: {
                    ...chat,
                    messages: [...chat.messages, {
                        id: Date.now(),
                        text: input,
                        sender: 'Support',
                        time,
                        isCustomer: false
                    }]
                }
            };
        });

        setInput('');
    };

    // Filter conversations based on the active room toggle
    const conversationList = Object.values(conversations).filter(c => c.room === activeRoomKey);

    return (
        <Box sx={{ p: 3, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Live Support Center</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Paper elevation={0} sx={{ p: 0.5, bgcolor: '#f0f0f0', borderRadius: 2 }}>
                        {availableRooms.map((r) => (
                            <Box
                                key={r.key}
                                component="button"
                                onClick={() => {
                                    setActiveRoomKey(r.key);
                                    setSelectedId(null);
                                }}
                                sx={{
                                    px: 2, py: 1, borderRadius: 1.5, border: 'none',
                                    bgcolor: activeRoomKey === r.key ? 'white' : 'transparent',
                                    color: activeRoomKey === r.key ? 'primary.main' : 'text.secondary',
                                    fontWeight: activeRoomKey === r.key ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: activeRoomKey === r.key ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {r.label}
                                {Object.values(conversations).filter(c => c.room === r.key).length > 0 && (
                                    <Box sx={{ 
                                        minWidth: 18, height: 18, borderRadius: '50%', 
                                        bgcolor: activeRoomKey === r.key ? 'primary.main' : '#ccc', 
                                        color: 'white', fontSize: '10px', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {Object.values(conversations).filter(c => c.room === r.key).length}
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Paper>
                    <IconButton
                        color={isSoundEnabled ? "primary" : "default"}
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        title={isSoundEnabled ? "Mute Notifications" : "Enable Sound"}
                    >
                        {isSoundEnabled ? <span role="img" aria-label="sound">🔔</span> : <span role="img" aria-label="mute">🔕</span>}
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', gap: 2, overflow: 'hidden' }}>
                <Paper elevation={2} sx={{ width: 300, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">Active Customers</Typography>
                    </Box>
                    <List sx={{ flex: 1, overflowY: 'auto' }}>
                        {conversationList.length === 0 && (
                            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                                <Typography variant="body2">No customers in this area</Typography>
                            </Box>
                        )}
                        {conversationList.map((chat) => (
                            <React.Fragment key={chat.id}>
                                <ListItem
                                    button
                                    selected={selectedId === chat.id}
                                    onClick={() => setSelectedId(chat.id)}
                                    sx={{ py: 1.5 }}
                                >
                                    <Avatar sx={{ mr: 2, bgcolor: chat.unread > 0 ? 'error.main' : 'secondary.main', position: 'relative' }}>
                                        <PersonIcon />
                                        <Box sx={{
                                            position: 'absolute', bottom: 0, right: 0,
                                            width: 10, height: 10, borderRadius: '50%',
                                            bgcolor: '#44b700', border: '2px solid white'
                                        }} />
                                    </Avatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: chat.unread > 0 ? 'bold' : 'normal' }}>
                                                    {chat.name}
                                                </Typography>
                                                {chat.unread > 0 && (
                                                    <Box sx={{ bgcolor: 'error.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 10, fontSize: '10px', minWidth: 16, textAlign: 'center' }}>
                                                        {chat.unread}
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                        secondary={chat.lastMessage || 'Landed on page'}
                                        secondaryTypographyProps={{ noWrap: true, variant: 'caption', sx: { color: chat.unread > 0 ? 'text.primary' : 'text.secondary' } }}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
                <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
                    {!selectedId ? (
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', flexDirection: 'column', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 60, color: 'divider' }} />
                            <Typography color="textSecondary">Select a customer to start chatting</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: 'white' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {conversations[selectedId].name}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
                                {conversations[selectedId].messages.length === 0 && (
                                    <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                                        <Typography variant="body2">Customer is online. Send a welcome message!</Typography>
                                    </Box>
                                )}
                                {conversations[selectedId].messages.map((msg) => (
                                    <Box key={msg.id} sx={{
                                        alignSelf: msg.isCustomer ? 'flex-start' : 'flex-end',
                                        mb: 2,
                                        maxWidth: '70%'
                                    }}>
                                        <Paper sx={{
                                            p: 1.5,
                                            bgcolor: msg.isCustomer ? 'white' : 'primary.main',
                                            color: msg.isCustomer ? 'text.primary' : 'white',
                                            borderRadius: msg.isCustomer ? '0 15px 15px 15px' : '15px 0 15px 15px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            <Typography variant="body1">{msg.text}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5, textAlign: 'right' }}>
                                                {msg.time}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
                                <div ref={messagesEndRef} />
                            </Box>
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'white' }}>
                                <TextField
                                    fullWidth
                                    placeholder="Type your reply..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    size="small"
                                />
                                <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};





export default ChatPage;
