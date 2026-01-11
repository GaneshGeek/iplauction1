import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import PlayerCard from '../components/PlayerCard';
import BidControls from '../components/BidControls';
import TeamSidebar from '../components/TeamSidebar';
import SoldOverlay from '../components/SoldOverlay';
import playersData from '../data/mockData.json';
import { TEAMS_BOTS, shouldBotBid } from '../utils/aiLogic';

export default function SinglePlayerGame() {
    // Game State
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState(null);
    const [timer, setTimer] = useState(30);
    const [isSold, setIsSold] = useState(false);

    // Team State
    const [userTeam, setUserTeam] = useState({ id: 'user', name: 'My Team', color: '#10b981', purse: 10000, squadCount: 0 });
    const [bots, setBots] = useState(TEAMS_BOTS);
    const [bidHistory, setBidHistory] = useState([]); // [{ teamName: string, amount: number, time: string }]

    console.log("DEBUG: SinglePlayer State", { playersDataLength: playersData?.length, currentPlayerIndex });

    const currentPlayer = playersData?.[currentPlayerIndex];
    if (!currentPlayer && playersData?.length > 0) {
        console.error("Critical Error: Player data exists but currentPlayer is undefined");
    }

    const timerRef = useRef(null);

    // Initialization per player
    useEffect(() => {
        if (!currentPlayer) return;
        setCurrentBid(currentPlayer.basePrice);
        setHighestBidder(null);
        setTimer(30);
        setIsSold(false);
        setBidHistory([]);
    }, [currentPlayerIndex]);

    // Timer Logic
    useEffect(() => {
        if (isSold) return;
        if (timer > 0) {
            if (timer <= 5) {
                const tickSound = new Audio('/sounds/tick.mp3');
                tickSound.volume = 0.5;
                tickSound.play().catch(e => console.log("Audio play error:", e));
            }
            timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
        } else {
            handleSold();
        }
        return () => clearTimeout(timerRef.current);
    }, [timer, isSold]);

    // AI Turn Logic
    useEffect(() => {
        if (isSold) return;

        // If user is highest bidder, bots try to outbid
        // If no one is highest bidder (start), bots might open
        // Check every 2 seconds roughly, or random intervals
        const botThinkingTime = 1000 + Math.random() * 2000;

        const attemptBid = setTimeout(() => {
            // Pick a random bot to try
            const candidateBot = bots[Math.floor(Math.random() * bots.length)];

            // Can't bid against self
            if (highestBidder && highestBidder.id === candidateBot.id) return;

            if (shouldBotBid(candidateBot, currentBid, currentPlayer)) {
                // Determine increment
                let increment = 20;
                if (currentBid > 200) increment = 50;
                if (currentBid > 1000) increment = 100;

                const newBid = currentBid + increment;

                setCurrentBid(newBid);
                setHighestBidder(candidateBot);
                setTimer(10); // Reset timer to 10s after bot bid
                setBidHistory(prev => [{ teamName: candidateBot.name, amount: newBid, time: new Date().toLocaleTimeString() }, ...prev]);
            }
        }, botThinkingTime);

        return () => clearTimeout(attemptBid);
    }, [currentBid, highestBidder, isSold]);

    const handleSold = () => {
        setIsSold(true);
        if (highestBidder) {
            // Deduct purse
            if (highestBidder.id === 'user') {
                const winSound = new Audio('/sounds/win.mp3');
                winSound.play().catch(e => console.log("Audio play error:", e));
                setUserTeam(prev => ({ ...prev, purse: prev.purse - currentBid, squadCount: prev.squadCount + 1 }));
            } else {
                setBots(prev => prev.map(b =>
                    b.id === highestBidder.id
                        ? { ...b, purse: b.purse - currentBid, squadCount: b.squadCount + 1 }
                        : b
                ));
            }
        }

        setTimeout(() => {
            if (currentPlayerIndex < playersData.length - 1) {
                setCurrentPlayerIndex(prev => prev + 1);
            } else {
                alert("Auction Completed!");
            }
        }, 3000);
    };

    const handleUserBid = (amount) => {
        if (userTeam.purse < currentBid + amount) {
            alert("Not enough funds!");
            return;
        }

        // Cannot bid if already highest
        if (highestBidder?.id === 'user') return;

        const newBid = currentBid + amount;
        setCurrentBid(newBid);
        setHighestBidder(userTeam);
        setTimer(10); // Reset timer to 10s after user bid
        setBidHistory(prev => [{ teamName: userTeam.name, amount: newBid, time: new Date().toLocaleTimeString() }, ...prev]);
    };

    return (
        <div className="auction-layout">
            <Head><title>Vs AI | IPL Auction</title></Head>

            <div className="sidebar-container">
                <TeamSidebar teams={[userTeam, ...bots]} currentTeamId="user" />
            </div>

            <main className="main-stage">
                <header className="room-header">
                    <h1>Single Player Mode</h1>
                    <div className="status-badge">VS AI</div>
                </header>

                <div className="game-content">
                    <div className="player-section">
                        {!currentPlayer ? (
                            <div className="loading-state">
                                <h2>Loading Player...</h2>
                                <p>Debug: Index {currentPlayerIndex}</p>
                            </div>
                        ) : isSold ? (
                            <SoldOverlay winner={highestBidder} price={currentBid} />
                        ) : (
                            <PlayerCard player={currentPlayer} />
                        )}
                    </div>

                    <div className="controls-section">
                        <BidControls
                            currentBid={currentBid}
                            highestBidder={highestBidder}
                            onBid={handleUserBid}
                            timer={timer}
                        />
                    </div>
                </div>
            </main>

            <style jsx>{`
                .auction-layout {
                    display: flex;
                    height: 100vh;
                    overflow: hidden;
                    background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
                }

                @media (max-width: 768px) {
                    .auction-layout {
                        flex-direction: column;
                        overflow-y: auto; /* Allow scroll on body for mobile if needed */
                    }
                    .main-stage {
                        height: auto !important; /* Let content expand */
                        overflow-y: visible !important;
                    }
                }

                .sidebar-container {
                    flex-shrink: 0;
                    border-right: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(20px);
                    z-index: 10;
                }

                .main-stage {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    position: relative;
                    overflow-y: auto;
                    height: 100%;
                }

                .room-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .status-badge {
                    background: var(--primary);
                    color: black;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-weight: 700;
                }

                /* Layout Grid/Flex */
                .game-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center; /* Center vertically in available space */
                    gap: 1rem;
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding-bottom: 2rem;
                }

                .player-section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    order: 1; 
                }

                .controls-section {
                    width: 100%;
                    max-width: 400px;
                    order: 2;
                }

                /* Desktop Layout */
                @media (min-width: 1024px) {
                    .game-content {
                        flex-direction: row; /* Parallel / Side-by-side */
                        justify-content: center;
                        align-items: center; /* Vertically center them relative to each other */
                        gap: 4rem; /* More space between them */
                        padding-top: 0;
                    }

                    .controls-section {
                        width: 350px;
                        order: 1; /* Controls on Left */
                    }

                    .player-section {
                        width: 400px;
                        order: 2; /* Player on Right */
                    }
                }

                /* Responsive Scaling for smaller laptops */
                @media (min-width: 1024px) and (max-height: 800px) {
                    .game-content {
                        transform: scale(0.85);
                        transform-origin: center center;
                    }
                }
                
                @media (min-width: 1024px) and (max-height: 700px) {
                    .game-content {
                        transform: scale(0.75);
                         transform-origin: center center;
                    }
                }

                .loading-state {
                    color: white;
                    text-align: center;
                }

                .sold-overlay {
                    text-align: center;
                    animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .sold-overlay h1 { font-size: 5rem; color: var(--primary); }
                .price { font-size: 2rem; color: white; margin-top: 1rem; }

                @keyframes zoomIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .sidebar-container {
                    width: 100%;
                    height: auto;
                    border-right: none;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                @media (min-width: 769px) {
                    .sidebar-container {
                        width: auto;
                        height: 100%;
                        border-right: 1px solid rgba(255,255,255,0.1);
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
}
