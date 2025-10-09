import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub API route
app.post('/api/fetch-stats', async (req, res) => {
  try {
    const { team } = req.body;

    if (!team || !Array.isArray(team)) {
      return res.status(400).json({ error: "Missing or invalid team array" });
    }

    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
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
        avatars[member.username] = "/favicon.ico";
      }
    }

    return res.status(200).json({ stats, avatars });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});