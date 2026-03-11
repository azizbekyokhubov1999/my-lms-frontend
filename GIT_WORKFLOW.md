# Git workflow – my-lms-frontend

This project has its **own Git repository** and remote. Use this folder for all commits and pushes.

## One-time: create the GitHub repo

1. Open **https://github.com/new**
2. **Repository name:** `my-lms-frontend` (or any name you prefer)
3. Leave it **empty** (no README, no .gitignore)
4. Click **Create repository**
5. If you used a different name, set the remote in this folder:
   ```bash
   cd my-lms-frontend
   git remote set-url origin https://github.com/azizbekyokhubov1999/YOUR-REPO-NAME.git
   ```
6. Push:
   ```bash
   git push -u origin main
   ```

## Daily workflow: push your changes

From the **my-lms-frontend** folder:

```bash
cd d:\Cursor_projects\online_university\my-lms-frontend

# 1. See what changed
git status

# 2. Stage changes (all files)
git add -A

# Or stage specific files:
# git add src/app/admission/notifications/page.tsx

# 3. Commit with a message
git commit -m "Short description of what you did"

# 4. Push to GitHub
git push
```

## Useful commands

| What you want              | Command |
|----------------------------|--------|
| See changed files          | `git status` |
| See commit history         | `git log --oneline` |
| Discard changes in a file   | `git checkout -- path/to/file` |
| Pull latest from GitHub    | `git pull` |
| Create a new branch        | `git checkout -b feature-name` |

## Remotes

- **origin** = your GitHub repo (e.g. `https://github.com/azizbekyokhubov1999/my-lms-frontend.git`)

Check with: `git remote -v`
