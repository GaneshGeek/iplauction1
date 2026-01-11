import { useState, useEffect } from 'react';
import Head from 'next/head';
import PlayerCard from '../components/PlayerCard';
import BidControls from '../components/BidControls';
import TeamSidebar from '../components/TeamSidebar';
import playersData from '../data/mockData.json';

const TEAMS = [
    { id: 't1', name: 'Royal Challengers', color: '#ff324d', purse: 5000, squadCount: 12 },
    { id: 't2', name: 'Chennai Super Kings', color: '#fca311', purse: 4500, squadCount: 14 },
    { id: 't3', name: 'Mumbai Indians', color: '#0056b3', purse: 4800, squadCount: 13 },
];

export default function MockAuction() {
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState(null);
    const [timer, setTimer] = useState(30);
    const [isSold, setIsSold] = useState(false);

    // User is T1
    const userTeamId = 't1';

    const currentPlayer = playersData[currentPlayerIndex];

    useEffect(() => {
        if (!currentPlayer) return;
        setCurrentBid(currentPlayer.basePrice);
        setHighestBidder(null);
        setTimer(30);
        setIsSold(false);
    }, [currentPlayerIndex]);

    useEffect(() => {
        if (isSold) return;

        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else {
            // Timer expired, player sold
            handleSold();
        }
    }, [timer, isSold]);

    const handleSold = () => {
        setIsSold(true);
        // In a real app we would update team purse here
        setTimeout(() => {
            if (currentPlayerIndex < playersData.length - 1) {
                setCurrentPlayerIndex(prev => prev + 1);
            } else {
                alert("Auction Completed!");
            }
        }, 3000);
    };

    const handleBid = (amount) => {
        // Simple logic: allow bid if user has money (mock check)
        const newBid = currentBid + amount;
        setCurrentBid(newBid);
        setHighestBidder(TEAMS.find(t => t.id === userTeamId));
        setTimer(30); // Reset timer on new bid
    };

    return (
        <div className="auction-layout">
            <Head>
                <title>Mock Auction Room</title>
            </Head>

            <div className="sidebar-container">
                <TeamSidebar teams={TEAMS} currentTeamId={userTeamId} />
            </div>

            <main className="main-stage">
                <header className="room-header">
                    <h1>Private Room #1234</h1>
                    <div className="status-badge">LIVE</div>
                </header>

                <div className="center-stage">
                    {isSold ? (
                        <div className="sold-overlay">
                            <h1>SOLD!</h1>
                            <p>To {highestBidder ? highestBidder.name : 'Unsold'}</p>
                            <p>for ₹ {currentBid} Lakh</p>
                        </div>
                    ) : (
                        <PlayerCard player={currentPlayer} />
                    )}
                </div>

                <div className="controls-container">
                    <BidControls
                        currentBid={currentBid}
                        highestBidder={highestBidder}
                        onBid={handleBid}
                        timer={timer}
                    />
                </div>
            </main>

            <style jsx>{`
                .auction-layout {
                    display: flex;
                    height: 100vh;
                    overflow: hidden;
                    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
                }

                .sidebar-container {
                    flex-shrink: 0;
                    border-right: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(20px);
                }

                .main-stage {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    position: relative;
                }

                .room-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .room-header h1 {
                    font-size: 1.5rem;
                    color: var(--text-muted);
                }

                .status-badge {
                    background: #ef4444;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                }

                .center-stage {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }

                .controls-container {
                    margin-top: auto;
                    max-width: 600px;
                    width: 100%;
                    margin-left: auto;
                    margin-right: auto;
                }

                .sold-overlay {
                    text-align: center;
                    animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .sold-overlay h1 {
                    font-size: 5rem;
                    color: var(--primary);
                    text-shadow: 0 0 30px var(--primary);
                }

                @keyframes zoomIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
