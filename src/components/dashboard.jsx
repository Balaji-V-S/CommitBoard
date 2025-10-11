import React, { useEffect, useState, useMemo } from "react";
import GitHubCalendar from "react-github-calendar";
import SortingControls from "./SortingControls";
import teamData from "../data/team.json";
import favicon from "/favicon.ico"; // fallback image
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // name, contributions, prs, issues
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/fetch-stats' : '/api/fetch-stats';
        
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ team: teamData }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          setError(`API Error: ${res.status} - ${errorText}`);
          return;
        }

        const json = await res.json();
        
        setStats(json.stats || {});
        setAvatars(json.avatars || {});
      } catch (err) {
        setError(`Network Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Sort team data
  const sortedData = useMemo(() => {
    const data = [...teamData];

    // Sort the data
    data.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "contributions":
          aValue = stats[a.username]?.contributions || 0;
          bValue = stats[b.username]?.contributions || 0;
          break;
        case "prs":
          aValue = stats[a.username]?.prs || 0;
          bValue = stats[b.username]?.prs || 0;
          break;
        case "issues":
          aValue = stats[a.username]?.issues || 0;
          bValue = stats[b.username]?.issues || 0;
          break;
        case "name":
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return data;
  }, [teamData, stats, sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  return (
    <div className="dashboard min-h-screen p-4">
      <header className="dashboard-header mb-12">
        <h1 className="dashboard-title">Contributors Dashboard</h1>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-message" role="alert" aria-live="assertive">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <p>Please check the console for more details.</p>
          {error.includes("GitHub token") && (
            <p>Make sure you have set up your GITHUB_TOKEN in .env.local file.</p>
          )}
          {error.includes("Network Error") && (
            <p>Make sure the API server is running on port 3001.</p>
          )}
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div className="loading-message" role="status" aria-live="polite">
          <h3>Loading GitHub Statistics</h3>
          <p>Fetching contribution data...</p>
        </div>
      )}

      {/* Sorting Controls */}
      <SortingControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        loading={loading}
      />

      {/* Contributors Grid */}
      <main className="dashboard-grid">
        {sortedData.map((member, index) => {
          const userStats = stats[member.username] || {};
          const avatar = avatars[member.username] || favicon;

          return (
            <article key={member.username || index} className="card text-center">
              <header className="card-header mb-8 flex items-center justify-center gap-6">
                <img
                  src={avatar}
                  alt={`${member.name}'s GitHub avatar`}
                  className="avatar h-16 w-16 flex-shrink-0 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = favicon)}
                  loading="lazy"
                />
                <div className="contributor-info min-w-0">
                  <h2 className="mb-2 text-2xl font-bold text-white">{member.name}</h2>
                  <div className="contributor-details flex items-center justify-center gap-4">
                    <p className="text-sm text-[#7fdbca] opacity-85">@{member.username}</p>
                  </div>
                </div>
              </header>

              <div className="badges my-6 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
                <div className="badge badge-blue">
                  <span>Contributions: {userStats.contributions ?? "-"}</span>
                </div>
                <div className="badge badge-green">
                  <span>PRs: {userStats.prs ?? "-"}</span>
                </div>
                <div className="badge badge-purple">
                  <span>Issues: {userStats.issues ?? "-"}</span>
                </div>
              </div>

              <div className="calendar mt-4">
                <h4 className="calendar-title mb-4 text-center text-lg font-semibold text-[#82aaff]">Contribution Activity</h4>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <GitHubCalendar
                    username={member.username}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={12}
                    hideTotalCount={false}
                    colorScheme="dark"
                    renderBlock={(block, activity) => {
                      const enhancedBlock = React.cloneElement(block, {
                        'data-tooltip': `${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${new Date(activity.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}`,
                        className: `${block.props.className} contribution-block`,
                        onMouseEnter: (e) => {
                          const tooltip = document.createElement('div');
                          tooltip.className = 'contribution-tooltip';
                          tooltip.innerHTML = `
                            <div class="tooltip-header">${member.name}</div>
                            <div class="tooltip-date">${new Date(activity.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</div>
                            <div class="tooltip-count">${activity.count} contribution${activity.count !== 1 ? 's' : ''}</div>
                          `;
                          document.body.appendChild(tooltip);

                          const rect = e.target.getBoundingClientRect();
                          const tooltipRect = tooltip.getBoundingClientRect();
                          
                          // Position tooltip above the block, centered
                          let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
                          let top = rect.top + window.scrollY - tooltipRect.height - 8;
                          
                          // Ensure tooltip stays within viewport
                          if (left < 10) left = 10;
                          if (left + tooltipRect.width > window.innerWidth - 10) {
                            left = window.innerWidth - tooltipRect.width - 10;
                          }
                          if (top < 10) {
                            // If not enough space above, show below
                            top = rect.bottom + window.scrollY + 8;
                          }
                          
                          tooltip.style.left = `${left}px`;
                          tooltip.style.top = `${top}px`;
                          tooltip.style.opacity = '1';
                        },
                        onMouseLeave: () => {
                          const tooltips = document.querySelectorAll('.contribution-tooltip');
                          tooltips.forEach(tooltip => {
                            tooltip.style.opacity = '0';
                            setTimeout(() => tooltip.remove(), 200);
                          });
                        }
                      });
                      return enhancedBlock;
                    }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* Empty State */}
      {sortedData.length === 0 && !loading && !error && (
        <div className="no-results" role="status">
          <h3>No Contributors Found</h3>
          <p>No team members to display.</p>
        </div>
      )}
    </div>
  );
}
