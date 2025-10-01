import '../styles/footer.css';

function footer() {
    return (
        <footer className="dashboard-footer">
            <span>© {new Date().getFullYear()} CommitBoard - All rights reserved</span>
            <a
                href="https://github.com/Balaji-V-S/CommitBoard"
                target="_blank"
                rel="noopener noreferrer"
                className="github-badge-link"
            >
                <img
                    src="https://img.shields.io/badge/GitHub%20Repo-000000?style=flat-square&logo=github&logoColor=white"
                    alt="GitHub Repo"
                    className="github-badge"
                />
            </a>
        </footer>

    );
}

export default footer;