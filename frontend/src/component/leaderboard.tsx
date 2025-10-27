import React, { useState } from "react";
import "../style/leaderboard.css";
import medalIcon from "../assets/medal.svg";
import catImage from "../assets/cat.png";

interface Profile {
  rank: number;
  name: string;
  bio: string;
  points: number;
}

const profiles: Profile[] = [
  { rank: 1, name: "Totata", bio: "Keep it up", points: 100 },
  { rank: 2, name: "bobatumana", bio: "Su su", points: 95 },
  { rank: 3, name: "keka", bio: "so maas", points: 87 },
  { rank: 4, name: "kiki", bio: "so smart", points: 75 },
  { rank: 5, name: "koka", bio: "kewaiii", points: 68 },
];

const Leaderboard: React.FC = () => {
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);

  return (
    <section className="leaderboard-card">
      <header className="title">
        <img src={medalIcon} alt="medal" className="medal" />
        <h1>Leaderboard</h1>
      </header>
      <div className="list-container">
      <ul className="profile-list">
        {profiles.map(({ rank, name, bio, points }) => (
          <li 
            key={rank} 
            className="profile-leaderboard"
            onMouseEnter={() => setHoveredRank(rank)}
            onMouseLeave={() => setHoveredRank(null)}
            style={{
              transform: hoveredRank === rank ? 'translateX(5px)' : 'translateX(0)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              backgroundColor: hoveredRank === rank ? '#f8f9fa' : 'transparent',
              borderRadius: '10px',
              padding: '8px',
            }}
          >
            <h2 style={{ 
              fontWeight: rank <= 3 ? 'bold' : 'normal',
              color: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#000'
            }}>
              {rank}
            </h2>
            <div className="details">
              <div className="profile-leader-image">
                <img src={catImage} alt="profile" className="image-leader" />
              </div>
              <div className="profile-info">
                <span className="name">{name}</span>
                <span className="bio">{bio}</span>
              </div>
            </div>
            <span className="points">{points}xp</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
  );
};

export default Leaderboard;
