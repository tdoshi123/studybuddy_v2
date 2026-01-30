# GitHub Pages Setup Guide for StudyBuddy v2

Your repository has been successfully configured for GitHub Pages deployment! 🎉

## What Was Done

### 1. Next.js Configuration
- ✅ Added `output: 'export'` to enable static site generation
- ✅ Configured `basePath: '/studybuddy_v2'` for GitHub Pages subdirectory
- ✅ Set `trailingSlash: true` for proper routing
- ✅ Enabled `images.unoptimized: true` for static images

### 2. GitHub Actions Workflow
- ✅ Created `.github/workflows/deploy.yml` for automated deployment
- ✅ Configured to build and deploy on every push to `main` branch
- ✅ Set up proper permissions for GitHub Pages deployment

### 3. Static Generation
- ✅ Added `generateStaticParams()` to all dynamic routes
- ✅ Restructured client components to support static export
- ✅ Successfully built 90 static pages

### 4. Repository Setup
- ✅ Initialized git repository
- ✅ Connected to remote: https://github.com/tdoshi123/studybuddy_v2.git
- ✅ Pushed all changes to the `main` branch

## Enable GitHub Pages (Required Steps)

To complete the setup and make your site live, follow these steps:

### Step 1: Go to Repository Settings
1. Navigate to https://github.com/tdoshi123/studybuddy_v2
2. Click on **Settings** (top navigation bar)

### Step 2: Enable GitHub Pages
1. In the left sidebar, click on **Pages** (under "Code and automation")
2. Under **Source**, select:
   - Source: **GitHub Actions** (not "Deploy from a branch")
3. The page will automatically refresh

### Step 3: Trigger the Deployment
The GitHub Actions workflow should trigger automatically on the next push, or you can:
1. Go to the **Actions** tab in your repository
2. Click on "Deploy Next.js to GitHub Pages" workflow
3. Click **Run workflow** > **Run workflow** (on main branch)

### Step 4: Wait for Deployment
1. The workflow will take 2-5 minutes to complete
2. You can monitor progress in the **Actions** tab
3. Look for a green checkmark ✅ when complete

### Step 5: Access Your Site
Once deployed, your site will be available at:

**🌐 https://tdoshi123.github.io/studybuddy_v2/**

## Troubleshooting

### If the site doesn't load:
- Wait 5-10 minutes after the first deployment
- Clear your browser cache
- Check the Actions tab for any errors

### If images don't load:
- Ensure all image paths are relative (e.g., `/studybuddy_v2/images/...`)
- Check that `next.config.ts` has `images.unoptimized: true`

### If pages show 404:
- Ensure `trailingSlash: true` is set in `next.config.ts`
- Check that all dynamic routes have `generateStaticParams()`

## Making Updates

To update your GitHub Pages site:

1. Make changes to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and redeploy your site
4. Changes will be live in 2-5 minutes

## Project Structure

```
studybuddy_v2/
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions deployment workflow
├── app/                     # Next.js app directory
│   ├── (dashboard)/        # Main app pages
│   └── globals.css         # Global styles
├── components/             # React components
├── lib/                    # Utilities and constants
├── next.config.ts          # Next.js configuration (GitHub Pages setup)
├── package.json           # Dependencies
└── out/                   # Built static files (generated, not committed)
```

## Key Files

### `next.config.ts`
Contains the GitHub Pages configuration:
- `output: 'export'` - Enables static export
- `basePath: '/studybuddy_v2'` - Sets the base URL path
- `trailingSlash: true` - Ensures proper routing

### `.github/workflows/deploy.yml`
Automates the build and deployment process:
- Runs on every push to `main`
- Builds the Next.js app
- Deploys to GitHub Pages

### `.nojekyll`
Tells GitHub Pages not to use Jekyll processing

## Additional Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

If you encounter any issues:
1. Check the Actions tab for deployment logs
2. Review the Next.js build output
3. Verify GitHub Pages is enabled in repository settings

---

**Your StudyBuddy application is now configured for GitHub Pages! 🚀**

Remember to enable GitHub Pages in your repository settings to make it live.
