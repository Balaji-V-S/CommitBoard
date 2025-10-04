import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import teamData from "../data/team.json";
import favicon from "/favicon.ico"; // fallback image
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
  async function fetchStats() {
    try {
      const res = await fetch("/api/fetch-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team: teamData }),
      });

      const json = await res.json();
      setStats(json.stats);
      setAvatars(json.avatars);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  fetchStats();
}, []);



  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Commitors Month Dashboard</h1>

      <div className="dashboard-grid">
        {teamData.map((member, index) => {
          const userStats = stats[member.username] || {};
          const avatar = avatars[member.username] || favicon;

          return (
            <div key={index} className="card">
              <div className="card-header">
                <img
                  src={avatar}
                  alt={`${member.username} avatar`}
                  className="avatar"
                  onError={(e) => (e.currentTarget.src = favicon)}
                />
                <div>
                  <h2>{member.name}</h2>
                  <p>@{member.username}</p>
                </div>
              </div>

              <div className="badges">
                <span className="badge badge-blue">
                  Contributions: {userStats.contributions ?? "-"}
                </span>
                <span className="badge badge-green">
                  PRs: {userStats.prs ?? "-"}
                </span>
                <span className="badge badge-purple">
                  Issues: {userStats.issues ?? "-"}
                </span>
              </div>

              <div className="calendar">
                <GitHubCalendar
                  username={member.username}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  hideTotalCount={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
