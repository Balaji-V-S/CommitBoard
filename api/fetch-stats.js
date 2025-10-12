export default async function handler(req, res) {
  const ALLOWED_ORIGINS = [
    "https://commit-board.vercel.app", // production
    "http://localhost:3000", // vercel dev port
    "http://localhost:5173"  // vite dev port
  ];
  
  // CORS
  const origin = req.headers.origin;
  
  // In development, allow requests without origin (direct server requests)
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin); //removed null origin access
  
  if (!isAllowedOrigin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const allowedOrigin = origin || ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { team } = req.body;

  if (!team || !Array.isArray(team)) {
    return res.status(400).json({ error: "Missing or invalid team array" });
  }

  // Check if GitHub token is available
  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN environment variable is not set");
    return res.status(500).json({ error: "GitHub token not configured" });
  }

  const stats = {};
  const avatars = {};

  for (let member of team) {
    try {
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

      const ghRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const json = await ghRes.json();
      const user = json?.data?.user;

      if (user) {
        const data = user.contributionsCollection;
        stats[member.username] = {
          contributions: data.contributionCalendar.totalContributions,
          prs: data.pullRequestContributions.totalCount,
          issues: data.issueContributions.totalCount,
        };
        avatars[member.username] = user.avatarUrl || "/favicon.ico";
      } else {
        avatars[member.username] = "/favicon.ico";
      }
    } catch (err) {
      console.error(`GitHub fetch failed for ${member.username}`, err);
      avatars[member.username] = "/favicon.ico";
    }
  }

  return res.status(200).json({ stats, avatars });
}
