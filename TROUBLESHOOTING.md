# 🔧 Troubleshooting GitHub Pages 404 Error

## The Problem
You're seeing a "404 File not found" error when visiting your GitHub Pages URL.

## Solution: Enable GitHub Pages

### Step 1: Enable GitHub Pages in Repository Settings

1. **Go to your repository**: https://github.com/tdoshi123/studybuddy_v2

2. **Click on "Settings"** (top navigation bar)

3. **Click on "Pages"** (left sidebar, under "Code and automation")

4. **Under "Build and deployment"**:
   - **Source**: Select **"GitHub Actions"** from the dropdown
   - **NOT** "Deploy from a branch"
   
   ![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

5. Click **"Save"** if there's a save button

### Step 2: Trigger the Deployment Workflow

**Option A: Automatic (Recommended)**
- The workflow should trigger automatically once you enable GitHub Pages
- Wait 2-5 minutes and check the Actions tab

**Option B: Manual Trigger**
1. Go to the **"Actions"** tab: https://github.com/tdoshi123/studybuddy_v2/actions
2. Click on **"Deploy Next.js to GitHub Pages"** workflow (left sidebar)
3. Click the **"Run workflow"** button (right side)
4. Select **"main"** branch
5. Click **"Run workflow"** button (green)

### Step 3: Monitor the Deployment

1. Go to **Actions** tab: https://github.com/tdoshi123/studybuddy_v2/actions
2. You should see a workflow running (yellow dot 🟡)
3. Wait for it to complete (green checkmark ✅)
4. This usually takes 2-5 minutes

### Step 4: Access Your Site

Once the workflow completes successfully, your site will be available at:

**🌐 https://tdoshi123.github.io/studybuddy_v2/**

## Still Getting 404?

### Check 1: Verify GitHub Pages is Enabled
1. Go to Settings → Pages
2. You should see: "Your site is live at https://tdoshi123.github.io/studybuddy_v2/"
3. If you don't see this message, GitHub Pages isn't enabled yet

### Check 2: Verify Workflow Succeeded
1. Go to Actions tab
2. Look for the latest "Deploy Next.js to GitHub Pages" workflow
3. It should have a green checkmark ✅
4. If it has a red X ❌, click on it to see the error logs

### Check 3: Wait a Few Minutes
- First deployment can take 5-10 minutes
- GitHub Pages needs time to propagate
- Try clearing your browser cache

### Check 4: Verify the Deployment
1. Go to Actions tab
2. Click on the latest successful workflow
3. Scroll down to "Deployment"
4. Click on the deployment URL shown there

## Common Issues and Fixes

### Issue: "Repository not found" in Actions
**Fix**: Enable GitHub Pages first (Step 1 above)

### Issue: Build fails with errors
**Fix**: Check the Actions logs for specific errors
- Usually related to dependencies or TypeScript errors
- The build worked locally, so this is rare

### Issue: Site loads but shows blank page
**Fix**: 
1. Check browser console for errors (F12)
2. Verify `basePath: '/studybuddy_v2'` in `next.config.ts`
3. Make sure you're accessing the correct URL

## Manual Verification

To manually verify everything is set up:

1. **Check the Actions tab**: https://github.com/tdoshi123/studybuddy_v2/actions
   - You should see successful workflow runs

2. **Check the gh-pages branch**: https://github.com/tdoshi123/studybuddy_v2/deployments
   - Should show recent deployments

3. **Check Settings → Pages**: https://github.com/tdoshi123/studybuddy_v2/settings/pages
   - Should show "Your site is live at..."

## Need More Help?

If you're still having issues after following these steps:

1. **Share the Actions log**:
   - Go to Actions tab
   - Click on the failed/latest workflow
   - Share any error messages you see

2. **Verify repository settings**:
   - Make sure the repository is public (Settings → General)
   - Private repos require GitHub Pro for Pages

3. **Try a test push**:
   ```bash
   cd /Users/leonardclay/Downloads/studybuddy_v2
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```
   This will trigger the workflow again

## Quick Checklist

- [ ] Repository is public
- [ ] GitHub Pages is enabled in Settings → Pages
- [ ] Source is set to "GitHub Actions"
- [ ] Workflow has run successfully (green checkmark in Actions)
- [ ] Waited 5-10 minutes after first deployment
- [ ] Accessing correct URL: https://tdoshi123.github.io/studybuddy_v2/

---

**Most likely cause**: You haven't enabled GitHub Pages in the repository settings yet. Follow Step 1 above! 👆
