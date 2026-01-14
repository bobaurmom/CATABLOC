import React, { useState, useEffect } from "react";
import "../style/leaderboard.css";
import medalIcon from "../assets/medal.svg";
import catImage from "../assets/cat.png";
import apiFetch from "../services/profile";

interface LeaderboardProfile {
  rank?: number;
  username: string;
  total_exp: number;
}

const Leaderboard: React.FC = () => {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiFetch('/api/dashboard/dashboard');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard data:', data);
          
          // Add rank to each profile
          const rankedProfiles = data.leaderboard.map((profile: LeaderboardProfile, index: number) => ({
            ...profile,
            rank: index + 1
          }));
          
          setProfiles(rankedProfiles);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch leaderboard:', response.status, errorText);
          setError('Failed to load leaderboard');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Unable to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; 
      case 2: return '#C0C0C0'; 
      case 3: return '#CD7F32'; 
      default: return '#000';
    }
  };

  return (
    <section className="leaderboard-card">
      <header className="title">
        <img src={medalIcon} alt="medal" className="medal" />
        <h1>Leaderboard</h1>
      </header>
      
      {error && (
        <div style={{
          padding: '12px',
          background: '#fee',
          borderRadius: '8px',
          margin: '12px',
          color: '#c00',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className="list-container">
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            Loading leaderboard...
          </div>
        ) : profiles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            No players yet
          </div>
        ) : (
          <ul className="profile-list">
            {profiles.map(({ rank = 0, username, total_exp }) => (
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
                  color: getRankColor(rank)
                }}>
                  {rank}
                </h2>
                <div className="details">
                  <div className="profile-leader-image">
                    <img src={catImage} alt={`${username}'s profile`} className="image-leader" />
                  </div>
                  <div className="profile-info">
                    <span className="name">{username}</span>
                    <span className="bio">
                      {rank === 1 && "🏆 Champion"}
                      {rank === 2 && "🥈 Runner-up"}
                      {rank === 3 && "🥉 Third place"}
                      {rank > 3 && "Keep climbing!"}
                    </span>
                  </div>
                </div>
                <span className="points">{total_exp}xp</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;