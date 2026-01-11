import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const SoldOverlay = ({ winner, price }) => {
    useEffect(() => {
        // Fire confetti when component mounts
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#fca311', '#ffffff'] // Primary colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#fca311', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="sold-overlay"
        >
            <div className="content glass">
                <h1 className="sold-text">SOLD!</h1>
                <div className="details">
                    <span className="label">To</span>
                    <div className="winner-name" style={{ color: winner?.color || '#fff' }}>
                        {winner ? winner.name : 'Unsold'}
                    </div>
                    <div className="price-tag">
                        ₹ {price} Lakh
                    </div>
                </div>
            </div>

            <style jsx>{`
        .sold-overlay {
            position: absolute;
            z-index: 50;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .content {
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid var(--primary);
            box-shadow: 0 0 50px rgba(252, 163, 17, 0.3);
        }

        .sold-text {
            font-size: 5rem;
            font-weight: 900;
            margin: 0;
            background: linear-gradient(to bottom, #fff, #fca311);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 10px rgba(252, 163, 17, 0.5));
            letter-spacing: -2px;
        }

        .details {
            margin-top: 1.5rem;
        }

        .label {
            font-size: 1rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .winner-name {
            font-size: 2rem;
            font-weight: 700;
            margin: 0.5rem 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .price-tag {
            font-size: 2.5rem;
            font-weight: 800;
            color: #fff;
            background: var(--primary);
            color: #000;
            display: inline-block;
            padding: 0.5rem 1.5rem;
            border-radius: 99px;
            margin-top: 0.5rem;
            transform: rotate(-3deg);
        }
      `}</style>
        </motion.div>
    );
};

export default SoldOverlay;
