import { useRouter } from 'next/router';
import { useRoomData } from '../../hooks/useLobby';
import { Copy, Play } from 'lucide-react';
import Head from 'next/head';

export default function LobbyRoom() {
    const router = useRouter();
    const { roomId } = router.query;
    const roomData = useRoomData(roomId);

    if (!roomData) return <div className="loading">Loading Lobby...</div>;

    const copyCode = () => {
        navigator.clipboard.writeText(roomId);
        alert("Room ID copied!");
    };

    return (
        <div className="lobby-room">
            <Head><title>Lobby | {roomId}</title></Head>

            <main className="content glass">
                <header className="lobby-header">
                    <h2>Waiting Lounge</h2>
                    <div className="room-info">
                        <div className="room-code" onClick={copyCode} title="Click to copy ID">
                            <span>ID: {roomId}</span>
                            <Copy size={16} />
                        </div>
                        {roomData.password && (
                            <div className="room-code" onClick={() => { navigator.clipboard.writeText(roomData.password); alert("Password copied!"); }} title="Click to copy Password">
                                <span>Pass: {roomData.password}</span>
                                <Copy size={16} />
                            </div>
                        )}
                    </div>
                </header>

                <div className="teams-grid">
                    {roomData.teams.map((team, idx) => (
                        <div key={idx} className="team-slot" style={{ borderColor: team.color }}>
                            <div className="avatar" style={{ background: team.color }}>
                                {team.owner[0].toUpperCase()}
                            </div>
                            <span className="name">{team.owner}</span>
                            <span className="role">{idx === 0 ? 'HOST' : 'PLAYER'}</span>
                        </div>
                    ))}
                    {[...Array(8 - roomData.teams.length)].map((_, i) => (
                        <div key={`empty-${i}`} className="team-slot empty">
                            <span>Waiting...</span>
                        </div>
                    ))}
                </div>

                <div className="actions">
                    <p className="status-text">Waiting for host to start...</p>
                    {/* Only host can see this - simplified for now */}
                    <button className="btn primary start-btn" onClick={() => router.push(`/game/${roomId}`)}>
                        <Play size={20} />
                        Start Auction
                    </button>
                </div>
            </main>

            <style jsx>{`
                .lobby-room {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                
                .loading {
                    color: white; 
                    font-size: 1.5rem;
                }

                .content {
                    width: 100%;
                    max-width: 800px;
                    padding: 2rem;
                }

                .lobby-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1rem;
                }

                .room-info {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .room-code {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.1);
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: monospace;
                    transition: background 0.2s;
                }
                .room-code:hover {
                    background: rgba(255,255,255,0.2);
                }

                .teams-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .team-slot {
                    background: rgba(0,0,0,0.2);
                    border: 2px solid #555;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .team-slot.empty {
                    border-style: dashed;
                    opacity: 0.5;
                    justify-content: center;
                }

                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.2rem;
                    color: #000;
                }

                .name {
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .role {
                    font-size: 0.7rem;
                    background: rgba(255,255,255,0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .actions {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .start-btn {
                    padding: 1rem 3rem;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--primary);
                    color: black;
                    border-radius: 99px;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}
