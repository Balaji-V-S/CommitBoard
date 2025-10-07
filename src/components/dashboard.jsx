import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import favicon from "/favicon.ico";
import teamData from '../data/team.json'

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
    <div className="min-h-screen bg-[#011627] p-8 font-[system-ui] text-[#d6deeb]">
      <h1 className="text-center text-3xl font-bold text-[#82aaff] mb-10">
        Commitors Month Dashboard
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        {teamData.map((member, index) => {
          const userStats = stats[member.username] || {};
          const avatar = avatars[member.username] || favicon;

          return (
            <div
              key={index}
              className="bg-[#0b253a] border border-[#1d3b53] rounded-2xl p-6 text-[#d6deeb] 
                         shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={avatar}
                  alt={`${member.username} avatar`}
                  onError={(e) => (e.currentTarget.src = favicon)}
                  className="w-10 h-10 rounded-full border-2 border-[#1d3b53] object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{member.name}</h2>
                  <p className="text-[#7fdbca] text-sm mt-1">@{member.username}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 my-4">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#1d3b53] text-[#82aaff]">
                  Contributions: {userStats.contributions ?? "-"}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#1d3b53] text-[#addb67]">
                  PRs: {userStats.prs ?? "-"}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#1d3b53] text-[#c792ea]">
                  Issues: {userStats.issues ?? "-"}
                </span>
              </div>
              <div class="cal">
                <div className="w-full overflow-hidden">
                  <div className="scale-95 sm:scale-100 origin-top">
                    <GitHubCalendar
                      username={member.username}
                      blockSize={12}
                      blockMargin={4}
                      fontSize={12}
                      hideTotalCount={false}
                    />
                  </div>
                </div>
                <style>
                  {` .cal svg {
                      width: 100% !important;
                      height: auto !important;
                      }
                  `}
                </style>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
