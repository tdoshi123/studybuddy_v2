# 🚀 Deploy StudyBuddy to Vercel (with Database Support)

## Why Vercel Instead of GitHub Pages?

✅ **Server-side features** (API routes, server components)  
✅ **Database connections** (PostgreSQL, MongoDB, etc.)  
✅ **Environment variables** (secure database credentials)  
✅ **Automatic deployments** on every push  
✅ **Free tier** with generous limits  

❌ GitHub Pages only supports static sites (no database, no API routes)

---

## 📦 Step 1: Prepare Your Project

Your project is now configured for dynamic deployment with database support!

### Changes Made:
- ✅ Removed `output: 'export'` from `next.config.ts`
- ✅ Removed GitHub Pages workflow
- ✅ Added `vercel.json` configuration
- ✅ Ready for server-side features and database

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Create Vercel Account** (if you don't have one)
   - Go to https://vercel.com/signup
   - Sign up with GitHub (recommended)

2. **Import Your Repository**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Find and select: `tdoshi123/studybuddy_v2`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - Click "Deploy"

4. **Wait for Deployment** (2-3 minutes)
   - Your site will be live at: `https://studybuddy-v2-xxxx.vercel.app`
   - Custom domain available in settings

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /Users/leonardclay/Downloads/studybuddy_v2
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: studybuddy-v2
# - Directory: ./
# - Override settings? No
```

---

## 💾 Step 3: Add Database (Choose One)

### Option 1: Vercel Postgres (Recommended)

1. **Go to your project on Vercel**
   - Dashboard → Your Project → Storage tab

2. **Create Database**
   - Click "Create Database"
   - Select "Postgres"
   - Choose region (closest to your users)
   - Click "Create"

3. **Get Connection String**
   - Vercel automatically adds environment variables
   - Access via `process.env.POSTGRES_URL`

4. **Install Dependencies**
```bash
npm install @vercel/postgres
# or
npm install pg
```

5. **Example Usage**
```typescript
// app/api/students/route.ts
import { sql } from '@vercel/postgres';

export async function GET() {
  const { rows } = await sql`SELECT * FROM students`;
  return Response.json(rows);
}
```

### Option 2: Supabase (PostgreSQL)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project (free tier)

2. **Get Credentials**
   - Settings → API
   - Copy: Project URL and anon/public key

3. **Add to Vercel**
   - Vercel Dashboard → Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Install Dependencies**
```bash
npm install @supabase/supabase-js
```

### Option 3: MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster

2. **Get Connection String**
   - Connect → Drivers → Copy connection string

3. **Add to Vercel**
   - Environment Variables → Add:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
     ```

4. **Install Dependencies**
```bash
npm install mongodb
# or
npm install mongoose
```

---

## 🔐 Step 4: Environment Variables

### Add Environment Variables on Vercel:

1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

2. Add your variables:
   ```
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

3. **Important**: Add for all environments (Production, Preview, Development)

4. **Redeploy** after adding environment variables
   - Deployments tab → Latest deployment → 3 dots → Redeploy

---

## 📝 Step 5: Update README

Let me update your README with deployment info:

```markdown
## 🚀 Deployment

This project is deployed on Vercel with full server-side support:

**Live Site**: https://studybuddy-v2.vercel.app

### Features:
- ✅ Server-side rendering
- ✅ API routes for database operations
- ✅ Environment variables for secure credentials
- ✅ Automatic deployments on push to main
```

---

## 🔄 Automatic Deployments

Once connected to Vercel:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Vercel automatically**:
   - Detects the push
   - Builds your project
   - Deploys to production
   - Takes 2-3 minutes

3. **Preview Deployments**:
   - Every PR gets a preview URL
   - Test before merging to main

---

## 🛠️ Local Development with Database

### 1. Create `.env.local` file:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studybuddy"

# Authentication (if using)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Add to `.gitignore` (already done):
```
.env*.local
```

### 3. Run development server:
```bash
npm run dev
```

---

## 📊 Example Database Setup

### Create Your First Table:

If using Vercel Postgres, run this in the SQL editor:

```sql
-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  grade_level INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255),
  room VARCHAR(100),
  period VARCHAR(100),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments (junction table)
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  course_id INTEGER REFERENCES courses(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  points INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Next Steps

1. **Deploy to Vercel** (follow Step 2)
2. **Set up your database** (follow Step 3)
3. **Add environment variables** (follow Step 4)
4. **Create your database schema** (see example above)
5. **Update your app to use real database** instead of mock data

---

## 📚 Useful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Docs](https://supabase.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

## 🆘 Need Help?

- Vercel Support: https://vercel.com/help
- Check deployment logs in Vercel Dashboard
- View build errors in the Deployments tab

---

**Your site will be live at a URL like: `https://studybuddy-v2.vercel.app`**

Vercel provides HTTPS, automatic scaling, and edge caching for free! 🎉
