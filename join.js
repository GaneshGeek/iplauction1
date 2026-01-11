import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLobby } from '../../hooks/useLobby';
import { useAuth } from '../../hooks/useAuth';
import Head from 'next/head';

export default function JoinLobby() {
    const { user } = useAuth();
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { handleJoinRoom, loading, error } = useLobby();

    useEffect(() => {
        if (user?.displayName) {
            setName(user.displayName);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !roomId.trim()) return;
        handleJoinRoom(roomId, name, password);
    };

    return (
        <div className="lobby-container">
            <Head><title>Join Room | IPL Auction</title></Head>

            <div className="card glass">
                <h1 className="heading-gradient">Join Auction</h1>
                <p>Enter the Room ID to join your friends.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Room ID</label>
                        <input
                            type="text"
                            placeholder="e.g. 7Af3... (Paste ID here)"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Room Password (If required)</label>
                        <input
                            type="text"
                            placeholder="Enter room password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="btn secondary" disabled={loading}>
                        {loading ? 'Joining...' : 'Join Room'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .lobby-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .card {
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 450px;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                input {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 8px;
                    color: white;
                    font-size: 1rem;
                }
                input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .btn {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 700;
                    margin-top: 1rem;
                    color: white;
                }
                 .btn:hover {
                    background: rgba(255,255,255,0.2);
                 }
                .error {
                    color: #ef4444;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
}
