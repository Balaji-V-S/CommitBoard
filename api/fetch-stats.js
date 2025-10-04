export default async function handler(req, res) {
  const ALLOWED_ORIGIN = "https://commit-board.vercel.app"; // Change this to your frontend URL in production
  // CORS
  const origin = req.headers.origin;
  if(origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
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
