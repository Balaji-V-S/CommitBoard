import React from "react";
import "./SortingControls.css";

const SortingControls = ({
  sortBy,
  sortOrder,
  onSortChange,
  filterTeam,
  filterRole,
  onTeamChange,
  onRoleChange,
  uniqueTeams,
  uniqueRoles,
  totalCount,
  filteredCount,
  loading
}) => {
  // Sort button configurations
  const sortButtons = [
    {
      key: "name",
      label: "Name",
      description: "Sort by contributor name"
    },
    {
      key: "contributions",
      label: "Contributions",
      description: "Sort by total contributions"
    },
    {
      key: "prs",
      label: "Pull Requests",
      description: "Sort by pull requests created"
    },
    {
      key: "issues",
      label: "Issues",
      description: "Sort by issues created"
    }
  ];

  return (
    <section className="sorting-controls" aria-label="Dashboard controls">
      <div className="controls-container">
        {/* Sort Section */}
        <div className="controls-section">
          <h3 className="section-title">
            Sort Options
          </h3>
          <div className="sort-buttons" role="group" aria-label="Sort options">
            {sortButtons.map(({ key, label, description }) => (
              <button
                key={key}
                className={`sort-btn ${sortBy === key ? "active" : ""}`}
                onClick={() => onSortChange(key)}
                aria-pressed={sortBy === key}
                aria-label={`${description} ${sortBy === key ? (sortOrder === "asc" ? "ascending" : "descending") : ""}`}
                title={description}
                disabled={loading}
              >
                <span className="sort-label">{label}</span>
                {sortBy === key && (
                  <span 
                    className="sort-indicator" 
                    aria-hidden="true"
                    title={sortOrder === "asc" ? "Ascending order" : "Descending order"}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        {(uniqueTeams.length > 0 || uniqueRoles.length > 0) && (
          <div className="controls-section">
            <h3 className="section-title">
              Filter Options
            </h3>
            <div className="filter-controls">
              {uniqueTeams.length > 0 && (
                <div className="filter-group">
                  <label htmlFor="team-filter" className="filter-label">
                    Team
                  </label>
                  <select
                    id="team-filter"
                    className="filter-select"
                    value={filterTeam}
                    onChange={(e) => onTeamChange(e.target.value)}
                    aria-describedby="team-filter-desc"
                    disabled={loading}
                  >
                    <option value="all">All Teams ({totalCount})</option>
                    {uniqueTeams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                  <span id="team-filter-desc" className="sr-only">
                    Filter contributors by team
                  </span>
                </div>
              )}

              {uniqueRoles.length > 0 && (
                <div className="filter-group">
                  <label htmlFor="role-filter" className="filter-label">
                    Role
                  </label>
                  <select
                    id="role-filter"
                    className="filter-select"
                    value={filterRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                    aria-describedby="role-filter-desc"
                    disabled={loading}
                  >
                    <option value="all">All Roles ({totalCount})</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <span id="role-filter-desc" className="sr-only">
                    Filter contributors by role
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary" aria-live="polite">
          <span className="results-text">
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> contributors
          </span>
          {filteredCount !== totalCount && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                onTeamChange("all");
                onRoleChange("all");
              }}
              aria-label="Clear all filters"
              title="Clear all filters"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SortingControls;