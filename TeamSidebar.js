import { motion } from 'framer-motion';
import { Users, Wallet } from 'lucide-react';

const TeamSidebar = ({ teams, currentTeamId }) => {
    return (
        <div className="team-sidebar glass">
            <h3 className="sidebar-title">Teams</h3>
            <div className="teams-list">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className={`team-item ${team.id === currentTeamId ? 'active' : ''}`}
                        style={{ borderLeftColor: team.color }}
                    >
                        <div className="team-header">
                            <span className="team-name">{team.name}</span>
                            {team.id === currentTeamId && <span className="you-badge">YOU</span>}
                        </div>

                        <div className="team-stats">
                            <div className="stat">
                                <Wallet size={14} className="icon" />
                                <span>₹ {team.purse} L</span>
                            </div>
                            <div className="stat">
                                <Users size={14} className="icon" />
                                <span>{team.squadCount}/25</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .team-sidebar {
            width: 300px;
            height: 100%;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 768px) {
            .team-sidebar {
                width: 100%;
                height: auto;
                flex-direction: row;
                overflow-x: auto;
                padding: 1rem;
                gap: 1rem;
            }
            .sidebar-title {
                display: none;
            }
            .teams-list {
                flex-direction: row;
                gap: 1rem;
            }
            .team-item {
                min-width: 200px;
            }
        }

        .sidebar-title {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .teams-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow-y: auto;
        }

        .team-item {
            padding: 1rem;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            border-left: 4px solid #555;
            transition: var(--transition);
        }

        .team-item.active {
            background: rgba(255,255,255,0.1);
            border-left-width: 6px;
        }

        .team-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .team-name {
            font-weight: 600;
            font-size: 1rem;
        }

        .you-badge {
            font-size: 0.7rem;
            background: var(--primary);
            color: #000;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
        }

        .team-stats {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .stat {
            display: flex;
            align-items: center;
            gap: 6px;
        }
      `}</style>
        </div>
    );
};

export default TeamSidebar;
