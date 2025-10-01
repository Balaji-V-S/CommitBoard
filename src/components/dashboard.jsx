import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import teamData from "../data/team.json";
import favicon from "/favicon.ico"; // fallback image
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [avatars, setAvatars] = useState({});
  const GITHUB_API = "https://api.github.com/graphql";
  const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  useEffect(() => {
    async function fetchStats() {
      const results = {};
      const avatarsFetched = {};
      for (let member of teamData) {
        const query = `
          query {
            user(login: "${member.username}") {
              avatarUrl
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
                pullRequestContributions(first: 1) { totalCount }
                issueContributions(first: 1) { totalCount }
              }
            }
          }
        `;
        try {
          const res = await fetch(GITHUB_API, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          });

          const json = await res.json();
          const user = json.data.user;

          if (user) {
            const data = user.contributionsCollection;
            results[member.username] = {
              contributions: data.contributionCalendar.totalContributions,
              prs: data.pullRequestContributions.totalCount,
              issues: data.issueContributions.totalCount,
            };

            // store avatar
            avatarsFetched[member.username] = user.avatarUrl || favicon;
          } else {
            // fallback if user not found
            avatarsFetched[member.username] = favicon;
          }
        } catch (err) {
          console.error("Error fetching GitHub data:", err);
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
                  hideTotalCount
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
