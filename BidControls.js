import { motion } from 'framer-motion';
import { Gavel, Clock, ArrowUpCircle } from 'lucide-react';

const BidControls = ({ currentBid, highestBidder, onBid, timer }) => {
    return (
        <div className="bid-controls glass">
            <div className="timer-section">
                <Clock size={20} color={timer < 10 ? 'red' : 'white'} />
                <span className={`timer-value ${timer < 10 ? 'critical' : ''}`}>00:{timer < 10 ? `0${timer}` : timer}</span>
            </div>

            <div className="current-bid-display">
                <span className="label">Current Highest Bid</span>
                <div className="amount">
                    ₹ {currentBid} <span className="unit">Lakh</span>
                </div>
                {highestBidder ? (
                    <div className="bidder-badge" style={{ borderColor: highestBidder.color }}>
                        Held by {highestBidder.name}
                    </div>
                ) : (
                    <div className="bidder-badge" style={{ borderColor: '#888' }}>
                        Unsold
                    </div>
                )}
            </div>

            <div className="actions">
                <button className="bid-btn" onClick={() => onBid(20)}>
                    <ArrowUpCircle size={24} />
                    +20L
                </button>
                <button className="bid-btn" onClick={() => onBid(50)}>
                    <ArrowUpCircle size={24} />
                    +50L
                </button>
                <button className="bid-btn" onClick={() => onBid(100)}>
                    <ArrowUpCircle size={24} />
                    +1Cr
                </button>
            </div>

            <style jsx>{`
            .bid-controls {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .timer-section {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-size: 1.5rem;
                font-weight: 700;
                background: rgba(0,0,0,0.3);
                padding: 0.5rem;
                border-radius: var(--radius);
            }

            .timer-value.critical {
                color: #ef4444;
                animation: pulse 1s infinite;
            }

            .current-bid-display {
                text-align: center;
            }

            .label {
                font-size: 0.9rem;
                color: var(--text-muted);
            }
            
            .amount {
                font-size: 3rem;
                font-weight: 800;
                color: var(--primary);
                line-height: 1;
                margin: 0.5rem 0;
            }

            .unit {
                font-size: 1.5rem;
                color: #fff;
            }

            .bidder-badge {
                display: inline-block;
                padding: 4px 12px;
                background: rgba(255,255,255,0.05);
                border: 1px solid #fff;
                border-radius: 99px;
                font-size: 0.9rem;
            }

            .actions {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0.75rem;
            }

            .bid-btn {
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 1rem 0.5rem;
                border-radius: var(--radius);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                transition: var(--transition);
            }

            .bid-btn:hover {
                background: var(--primary);
                color: #000;
                transform: translateY(-2px);
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `}</style>
        </div>
    );
};

export default BidControls;
