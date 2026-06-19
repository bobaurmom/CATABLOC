import React, { useState, useRef } from "react";
import medalIcon from "../../assets/medal.svg";
import catImage from "../../assets/cat.png";
import apiFetch from "../../services/profile";

interface LeaderboardProfile {
  rank?: number;
  username: string;
  total_exp: number;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return '#FFD700'; 
    case 2: return '#C0C0C0'; 
    case 3: return '#CD7F32'; 
    default: return '#000';
  }
};

const Leaderboard: React.FC = () => {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  if (!fetchedRef.current) {
    fetchedRef.current = true;
    (async () => {
      try {
        const response = await apiFetch('/api/dashboard/dashboard');
        
        if (response.ok) {
          const data = await response.json();
          
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
    })();
  }

  return (
    <section className="flex flex-col items-start justify-start w-full min-h-[500px] bg-white rounded-[20px] p-[25px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
      <header className="flex flex-row items-center w-full mb-5 pb-[15px] border-b-2 border-[#f0f0f0]">
        <img src={medalIcon} alt="medal" className="w-[50px] h-[50px] rounded-full mr-[15px]" />
        <h1 className="text-2xl font-bold text-black">Leaderboard</h1>
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

      <div className="flex flex-col w-full flex-1 justify-start">
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            Loading leaderboard…
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
          <ul className="flex flex-col justify-start w-full h-full py-[10px] gap-2">
            {profiles.map(({ rank = 0, username, total_exp }) => (
              <li 
                key={rank}
                className="flex justify-start items-center w-full py-[10px] px-[5px] rounded-[10px] transition-all duration-200 gap-[10px]"
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
                  fontSize: '18px',
                  fontWeight: rank <= 3 ? 'bold' : 'normal',
                  color: getRankColor(rank),
                  minWidth: '20px',
                  textAlign: 'left',
                  margin: 0,
                  flexShrink: 0,
                }}>
                  {rank}
                </h2>
                <div className="flex items-center flex-1 gap-[10px]">
                  <div className="relative w-[45px] h-[45px] rounded-full bg-black p-[2px] m-0 shrink-0">
                    <img src={catImage} alt={`${username}'s profile`} className="h-full w-full object-cover flex flex-row items-center rounded-full" />
                  </div>
                  <div className="flex-1 flex flex-col ml-0">
                    <span className="text-black text-base font-medium">{username}</span>
                    <span className="text-[#666] text-sm font-normal">
                      {rank === 1 && "🏆 Champion"}
                      {rank === 2 && "🥈 Runner-up"}
                      {rank === 3 && "🥉 Third place"}
                      {rank > 3 && "Keep climbing!"}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-[rgb(190,167,35)] text-xl ml-auto whitespace-nowrap">{total_exp}xp</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;