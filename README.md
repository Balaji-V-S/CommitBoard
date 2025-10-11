<a href="https://balajivs.me"><img src="https://github.com/Balaji-V-S/Balaji-V-S/blob/main/Github%20Readme%20watermark.png" align="right" width="140" /></a>

# CommitBoard

CommitBoard is a React + Vite dashboard that visualizes a team’s GitHub activity for a specific month. It shows each member’s total contributions, PRs closed, issues resolved, and a contribution heatmap, fetching data in real-time via the GitHub GraphQL API.

---

## Features

* Display team member name, GitHub username, and avatar
* Track contributions, PRs closed, and issues resolved
* Show GitHub-style contribution heatmap
* Automatic updates from GitHub API

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Balaji-V-S/CommitBoard.git
cd commitboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Add team data

Create a JSON file at `src/data/team.json` with your team members:

```json
[
  {
    "name": "Alice Smith",
    "username": "alicegithub"
  },
  {
    "name": "Bob Johnson",
    "username": "bobjohnson"
  }
]
```

### 4. Set up GitHub Token

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate a token with the `read:user` scope
3. Create a `.env` file in the project root:

```env
GITHUB_TOKEN=your_github_token_here  //enter your API-KEY in Env Var while hosting
```

> **Note:** This token is used to fetch GitHub contributions. Keep it secret.

### 5. Run the app

```bash
npm run dev
# or
yarn dev
```

The dashboard should now be available at `http://localhost:5173`.

---

## Folder Structure

```
src/
 ├─ api/fetch-stats   # serverless function to hide Github PAT from frontend  
 ├─ components/       # React components (Dashboard.jsx)
 ├─ data/             # team.json file
 ├─ styles/           # stylesheets for components  
 ├─ .env              # for storing the GITHUB_TOKEN    
 ├─ App.jsx
 └─ main.jsx
```

---

## License

MIT License
