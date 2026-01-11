import { useState, useEffect } from 'react';
import { useLobby } from '../../hooks/useLobby';
import { useAuth } from '../../hooks/useAuth';
import Head from 'next/head';

export default function CreateLobby() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { handleCreateRoom, loading, error } = useLobby();

    useEffect(() => {
        if (user?.displayName) {
            setName(user.displayName);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        handleCreateRoom(name, password);
    };

    return (
        <div className="lobby-container">
            <Head><title>Create Room | IPL Auction</title></Head>

            <div className="card glass">
                <h1 className="heading-gradient">Create Auction Room</h1>
                <p>Host your own auction and invite friends.</p>

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
                        <label>Room Password (Optional)</label>
                        <input
                            type="text"
                            placeholder="Set a password for your room"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="btn primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Room'}
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
                .btn.primary {
                     background: var(--primary);
                     color: #000; /* Ensure high contrast */
                }
                .error {
                    color: #ef4444;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
}
