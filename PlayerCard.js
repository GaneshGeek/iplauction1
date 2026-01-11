import { motion } from 'framer-motion';
import { User, Activity, MapPin, TrendingUp, Shield } from 'lucide-react';

const PlayerCard = ({ player }) => {
    if (!player) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={player.id}
            className="player-card glass"
        >
            <div className="image-container">
                <img src={player.image} alt={player.name} className="player-image" />
                <div className="role-badge">{player.role}</div>
            </div>

            <div className="info">
                <h2 className="name">{player.name}</h2>
                <div className="country">
                    <MapPin size={14} />
                    {player.country}
                </div>

                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="label">Matches</span>
                        <span className="value">{player.stats.matches}</span>
                    </div>
                    {player.role === 'Bowler' ? (
                        <>
                            <div className="stat-item">
                                <span className="label">Wickets</span>
                                <span className="value">{player.stats.wickets}</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">Economy</span>
                                <span className="value">{player.stats.economy}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat-item">
                                <span className="label">Runs</span>
                                <span className="value">{player.stats.runs}</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">SR</span>
                                <span className="value">{player.stats.strikeRate}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="base-price">
                    <span>Base Price</span>
                    <h3>₹ {player.basePrice} Lakh</h3>
                </div>
            </div>

            <style jsx>{`
        .player-card {
            width: 100%;
            max-width: 400px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(20,33,61,0.5) 100%);
        }

        .image-container {
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            background: radial-gradient(circle at center, rgba(252, 163, 17, 0.2) 0%, transparent 70%);
            position: relative;
        }

        .player-image {
            height: 90%;
            object-fit: contain;
            filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
        }

        .role-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: #000;
            padding: 4px 12px;
            border-radius: 99px;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        .info {
            padding: 1.5rem;
        }

        .name {
            font-size: 2rem;
            margin-bottom: 0.25rem;
            background: linear-gradient(90deg, #fff, #bbb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .country {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(0,0,0,0.2);
            border-radius: var(--radius);
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }

        .stat-item .label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .stat-item .value {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary);
        }

        .base-price {
            text-align: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .base-price span {
            display: block;
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-bottom: 4px;
        }
        
        .base-price h3 {
             font-size: 1.5rem;
             color: #fff;
        }
      `}</style>
        </motion.div>
    );
};

export default PlayerCard;
