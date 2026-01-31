# 🚀 Quick Start Guide - Deploy StudyBuddy to Vercel

Your StudyBuddy code is now in your repository: **https://github.com/NappyyCoder/Studdy_Buddy_Vercel**

Follow these simple steps to get your site live with database support!

---

## ✅ Step 1: Verify Your Repository

Your code is live at: **https://github.com/NappyyCoder/Studdy_Buddy_Vercel**

Check that you can see:
- ✅ All your code files
- ✅ README.md
- ✅ DEPLOYMENT.md
- ✅ vercel.json

---

## 🌐 Step 2: Deploy to Vercel (5 minutes)

### A. Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### B. Import Your Repository

1. After logging in, you'll see the dashboard
2. Click **"Add New..."** → **"Project"**
3. Find **"NappyyCoder/Studdy_Buddy_Vercel"** in the list
4. Click **"Import"**

### C. Configure Project (Use Defaults)

Vercel auto-detects Next.js, so just click:
- **Framework Preset**: Next.js ✅ (auto-detected)
- **Root Directory**: `./` ✅ (default)
- **Build Command**: `npm run build` ✅ (default)
- **Output Directory**: `.next` ✅ (default)

### D. Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes while Vercel builds your app
3. 🎉 **Your site is live!**

You'll get a URL like: `https://studdy-buddy-vercel.vercel.app`

---

## 🔄 Step 3: Enable Auto-Deploy (Already Done!)

Since you imported from GitHub:
- ✅ Every push to `main` → Auto-deploys to production
- ✅ Every push to other branches → Creates preview URL
- ✅ Every pull request → Gets a unique preview link

### Test It:

```bash
cd /Users/leonardclay/Downloads/studybuddy_v2

# Make a small change
echo "# Test" >> test.md

# Commit and push
git add test.md
git commit -m "Test auto-deploy"
git push nappyy main

# Watch Vercel dashboard - it will auto-deploy! 🚀
```

---

## 💾 Step 4: Add Database (Optional - When You're Ready)

### Option A: Vercel Postgres (Easiest)

1. **Go to Vercel Dashboard** → Your Project → **Storage** tab
2. Click **"Create Database"** → Select **"Postgres"**
3. Choose region (closest to you)
4. Click **"Create"**

**Environment variables are automatically added!**

Access in your code:
```typescript
import { sql } from '@vercel/postgres';

const { rows } = await sql`SELECT * FROM students`;
```

### Option B: Supabase (More Features)

1. Go to **https://supabase.com** → Create project
2. Get your connection details
3. Add to Vercel:
   - Dashboard → Settings → Environment Variables
   - Add: `DATABASE_URL`, `SUPABASE_KEY`, etc.

### Option C: MongoDB Atlas

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Create free cluster
3. Get connection string
4. Add to Vercel environment variables

**Full database setup guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Your URLs

After deployment, you'll have:

| Environment | URL | Updates When |
|-------------|-----|--------------|
| **Production** | `https://studdy-buddy-vercel.vercel.app` | Push to `main` |
| **Preview** | `https://studdy-buddy-vercel-git-[branch].vercel.app` | Push to any branch |
| **Local** | `http://localhost:3000` | Run `npm run dev` |

---

## 🔑 Step 5: Set Up Environment Variables (When Needed)

For features like authentication, email, etc., add environment variables:

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add variables:**
   ```
   DATABASE_URL=postgres://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://studdy-buddy-vercel.vercel.app
   ```

3. **Redeploy** after adding variables:
   - Deployments tab → Latest → ⋯ → Redeploy

---

## 📱 Step 6: Invite Team Members

Want your teammate to access the Vercel dashboard?

1. **Vercel Dashboard** → Your Project → **Settings** → **Members**
2. Click **"Invite"**
3. Enter their email
4. They can now:
   - View deployments
   - Access environment variables
   - Trigger manual deploys

---

## 🎨 Step 7: Custom Domain (Optional)

Want `studybuddy.com` instead of `studdy-buddy-vercel.vercel.app`?

1. **Buy a domain** (Namecheap, Google Domains, etc.)
2. **Vercel Dashboard** → Your Project → **Settings** → **Domains**
3. Click **"Add"** → Enter your domain
4. Follow DNS instructions
5. Done! ✅

Vercel provides:
- ✅ Free SSL certificate
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## ✅ Checklist

- [ ] Code pushed to GitHub: https://github.com/NappyyCoder/Studdy_Buddy_Vercel
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] First deployment successful
- [ ] Site is live (check the Vercel dashboard for URL)
- [ ] Auto-deploy tested (make a push and watch it deploy)
- [ ] Database added (when ready)
- [ ] Environment variables configured (when needed)

---

## 🆘 Troubleshooting

### Build Fails
- Check **Deployments** tab in Vercel
- Click on failed deployment → View build logs
- Usually: missing dependencies or TypeScript errors

### Site Shows Error
- Check **Function Logs** in Vercel dashboard
- Look for runtime errors
- Verify environment variables are set

### Database Connection Issues
- Verify `DATABASE_URL` is in environment variables
- Check database is running (Vercel Postgres dashboard)
- Redeploy after adding database

---

## 🎓 Next Steps

1. **Deploy now** (Step 2 above)
2. **Test auto-deploy** by pushing a change
3. **Add database** when you're ready to replace mock data
4. **Invite your teammate** to collaborate
5. **Start building features!**

---

## 📚 Resources

- **Your Repo**: https://github.com/NappyyCoder/Studdy_Buddy_Vercel
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Ready to deploy?** Go to https://vercel.com/new and import your repo! 🚀

**Questions?** Check the deployment logs or open an issue on GitHub!
