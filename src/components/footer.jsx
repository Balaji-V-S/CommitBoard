function Footer() {
  return (
    <footer className="mt-12 px-8 py-4 flex justify-between items-center text-sm text-[#7f8caa] border-t border-[#1d3b53]">
      <span>© {new Date().getFullYear()} CommitBoard - All rights reserved</span>
      <a
        href="https://github.com/Balaji-V-S/CommitBoard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <img
          src="https://img.shields.io/badge/GitHub%20Repo-000000?style=flat-square&logo=github&logoColor=white"
          alt="GitHub Repo"
          className="h-7 align-middle transition-transform duration-200 hover:scale-110"
        />
      </a>
    </footer>
  );
}

export default Footer;
