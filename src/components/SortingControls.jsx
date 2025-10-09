import React from "react";
import "./SortingControls.css";

const SortingControls = ({
  sortBy,
  sortOrder,
  onSortChange,
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
      </div>
    </section>
  );
};

export default SortingControls;