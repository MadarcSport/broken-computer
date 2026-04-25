# Vercel Deployment Notes (What We Did and Why)

This file explains exactly how this project was deployed to Vercel, the errors we saw, and how we fixed them.

## Project Context

- Stack: React + Vite + TypeScript + React Three Fiber
- GitHub repository: `https://github.com/MadarcSport/broken-computer.git`
- Goal: deploy the project to Vercel production

## 1. Initialize Git in the Local Project

The folder was not a Git repository at first.

```bash
git init
```

Why this matters:

- Vercel deployment from GitHub needs your code in a git repository.

## 2. Fix Git "dubious ownership" Error (Windows)

Error we got:

```text
fatal: detected dubious ownership in repository ...
```

Fix we used:

```bash
git config --global --add safe.directory 'F:/Web Design courses/workspaces/computer-cube-broken-1'
```

Why this happens:

- On some Windows filesystems/mounts, Git cannot verify ownership metadata.
- Marking the folder as safe allows git commands to run normally.

## 3. Add and Push Project to GitHub

Commands:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/MadarcSport/broken-computer.git
git branch -M main
git push -u origin main
```

Why this matters:

- Your code must be on GitHub if you want Vercel Git-based deployments and auto-redeploy on push.

## 4. Start Vercel CLI Deployment

Commands:

```bash
vercel login
vercel
```

Prompt asked:

- "Would you like to pull environment variables now?"

Answer for this project:

- `N` (No), because this project does not currently use required environment variables.

## 5. First Build Failure on Vercel

Vercel error:

```text
Error: Command "npm run build" exited with 2
```

We reproduced locally:

```bash
npm run build
```

Root cause found:

- `src/components/TextureSwitcher.tsx` had an unused import:

```ts
import React from "react";
```

Fix applied:

- Removed the unused `React` import.

Why this failed deployment:

- TypeScript build in CI was strict and failed with `TS6133` (declared but never read).

## 6. Second Vercel Failure (Output Directory)

Vercel error:

```text
No Output Directory named "build" found after the Build completed.
```

Cause:

- Vite outputs production files to `dist`, not `build`.

Fix applied by adding `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Why this works:

- It tells Vercel exactly where the generated static files are after build.

## 7. Verify Locally Before Redeploy

We validated with:

```bash
npm run build
```

Confirmed:

- Build passed.
- `dist/` was created.

## 8. Redeploy

Commands used:

```bash
git add vercel.json
git commit -m "Fix Vercel output directory to dist"
git push
vercel --prod
```

Result:

- Deployment succeeded.

## 9. Meaning of the Two Vercel URLs

Example:

- `Production: https://broken-computer-xxxx.vercel.app`
- `Aliased: https://broken-computer.vercel.app`

Difference:

- `Production` URL is a unique, immutable URL for that specific deployment snapshot.
- `Aliased` URL is the stable project URL that always points to your latest production deployment.

Use `Aliased` URL when sharing your site publicly.

## Fast Checklist for Future Vite Deployments

1. `npm run build` locally first.
2. Ensure Vercel output directory is `dist`.
3. Commit and push all changes.
4. Deploy with Git integration or `vercel --prod`.
5. If deploy fails, read build logs and reproduce locally.

## Files Changed During This Deploy Fix

- `src/components/TextureSwitcher.tsx`
  - Removed unused React import.
- `vercel.json`
  - Set Vercel build command and output directory.

## But now, If I'm doing any change in my code and push to github, is vercel will modify it too or not

If your Vercel project is connected to your GitHub repo, then yes, Vercel will redeploy automatically when you push.

How it works:

Push to the Production Branch ( - 'usually main' ): Vercel creates a new production deployment and updates your live site.
Push to other branches (- or PRs - ): Vercel creates a preview deployment only, not replacing production.
If auto-deploy is disabled in Vercel settings, it won’t redeploy until you trigger it manually.
Quick check:

Vercel Dashboard -> your project -> Settings -> Git
Verify repo is linked and Auto Deploy is enabled
Verify which branch is set as Production Branch (main or master)
So: code changes in GitHub can update Vercel, but whether it updates the live site depends on which branch you push to.
