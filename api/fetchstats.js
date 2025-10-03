export default async function handler(req, res) {
    const ALLOWED_ORIGINS = [
        "https://commit-board.vercel.app"
    ];

    const origin = req.headers.origin;
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Handle preflight request
    }

    const { username } = req.query;
    if (!username) return res.status(400).json({ error: "Missing username" });

    const GITHUB_API = "https://api.github.com/graphql";
    const TOKEN = process.env.GITHUB_TOKEN;

    const query = `
    query {
      user(login: "${username}") {
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

    try {
        const ghRes = await fetch(GITHUB_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const json = await ghRes.json();
        return res.status(200).json(json.data.user || {});
    } catch (err) {
        console.error("GitHub API error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
