import React, { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import teamData from "../data/team.json";

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
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
                Commitors Month Dashboard
            </h1>

            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {teamData.map((member, index) => {
                    const userStats = stats[member.username] || {};
                    return (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-6 flex flex-col"
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {member.name}
                                </h2>
                                <p className="text-gray-500 text-sm">@{member.username}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    Contributions: {userStats.contributions ?? "-"}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    PRs: {userStats.prs ?? "-"}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    Issues: {userStats.issues ?? "-"}
                                </span>
                            </div>

                            {/* GitHub heatmap */}
                            <div className="overflow-x-auto">
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
