import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import teamData from "../data/team.json";
import "./Dashboard.css"; // 👈 Import vanilla CSS

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const GITHUB_API = "https://api.github.com/graphql";
    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

    useEffect(() => {
        async function fetchStats() {
            const results = {};
            for (let member of teamData) {
                const query = `
          query {
            user(login: "${member.username}") {
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
                    const data = json.data.user.contributionsCollection;
                    results[member.username] = {
                        contributions: data.contributionCalendar.totalContributions,
                        prs: data.pullRequestContributions.totalCount,
                        issues: data.issueContributions.totalCount,
                    };
                } catch (err) {
                    console.error("Error fetching GitHub data:", err);
                }
            }
            setStats(results);
        }
        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Commitors Month Dashboard</h1>

            <div className="dashboard-grid">
                {teamData.map((member, index) => {
                    const userStats = stats[member.username] || {};
                    return (
                        <div key={index} className="card">
                            <div className="card-header">
                                <h2>{member.name}</h2>
                                <p>@{member.username}</p>
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
