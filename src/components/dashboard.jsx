import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import teamData from "../data/team.json";
import favicon from "/favicon.ico"; // fallback image
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [avatars, setAvatars] = useState({});
  const GITHUB_API = "https://api.github.com/graphql";
  const TOKEN = import.meta.env.GITHUB_TOKEN;

  useEffect(() => {
  async function fetchStats() {
    const results = {};
    const avatarsFetched = {};

    for (let member of teamData) {
      try {
        const res = await fetch(`/api/fetchstats?username=${member.username}`);
        const user = await res.json();

        if (user && user.contributionsCollection) {
          const data = user.contributionsCollection;
          results[member.username] = {
            contributions: data.contributionCalendar.totalContributions,
            prs: data.pullRequestContributions.totalCount,
            issues: data.issueContributions.totalCount,
          };

          avatarsFetched[member.username] = user.avatarUrl || favicon;
        } else {
          avatarsFetched[member.username] = favicon;
        }
      } catch (err) {
        console.error("Error fetching via serverless:", err);
        avatarsFetched[member.username] = favicon;
      }
    }

    setStats(results);
    setAvatars(avatarsFetched);
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
