import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createRoom, joinRoom } from '../utils/gameService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useLobby() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleCreateRoom = async (hostName, password) => {
        setLoading(true);
        setError(null);
        try {
            const roomId = await createRoom(hostName, password);
            // Save user info locally
            sessionStorage.setItem('userName', hostName);
            sessionStorage.setItem('teamId', 't1'); // Host is always t1
            router.push(`/lobby/${roomId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (roomId, playerName, password) => {
        setLoading(true);
        setError(null);
        try {
            const teamId = await joinRoom(roomId, playerName, password);
            // Save user info locally
            sessionStorage.setItem('userName', playerName);
            sessionStorage.setItem('teamId', teamId);
            router.push(`/lobby/${roomId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateRoom, handleJoinRoom, loading, error };
}

export function useRoomData(roomId) {
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        const unsub = onSnapshot(doc(db, 'rooms', roomId), (doc) => {
            if (doc.exists()) {
                setRoomData({ id: doc.id, ...doc.data() });
            }
        });

        return () => unsub();
    }, [roomId]);

    return roomData;
}
