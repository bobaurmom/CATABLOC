import React from "react";
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
  { rank: 1, name: "Boba", bio: "Student", points: 10 },
  { rank: 2, name: "Boba", bio: "Student", points: 10 },
  { rank: 3, name: "Boba", bio: "Student", points: 10 },
  { rank: 4, name: "Boba", bio: "Student", points: 10 },
  { rank: 5, name: "Boba", bio: "Student", points: 10 },
];

const Leaderboard: React.FC = () => {
  return (
    <section className="leaderboard-card">
      <header className="title">
        <img src={medalIcon} alt="medal" className="medal" />
        <h1>Leaderboard</h1>
      </header>
      <ul className="profile-list">
        {profiles.map(({ rank, name, bio, points }) => (
          <li key={rank} className="profile-leaderboard">
            <h2>{rank}</h2>
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
    </section>
  );
};

export default Leaderboard;
