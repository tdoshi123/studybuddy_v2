# 🎓 StudyBuddy - Modern Student Information System

A modern, full-stack Student Information System (SIS) designed for K-12 students, teachers, and parents. Built with Next.js 15, TypeScript, and Tailwind CSS, with full database support via Vercel.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)

---

## 🌐 Live Demo

**Coming Soon:** Deploy to Vercel to get your live URL!

---

## ✨ Features

### 📊 Dashboard
- Course cards with color-coded subjects
- Responsive grid layout (2-3 columns)
- To-do list with upcoming assignments
- Modern, clean UI inspired by Canvas/Blackboard

### 📚 Course Management
- **Course Home**: Recent announcements and upcoming work
- **Content**: Organized syllabus, schedules, and materials
- **Grades**: Real-time grade tracking with detailed breakdown
- **Assignments**: Submit work with multiple formats (files, text, URLs)
- **Announcements**: Pinned and filterable announcements
- **Classlist**: View classmates and send emails

### 🚌 Additional Features
- Bus tracking with real-time updates
- Calendar integration (coming soon)
- Inbox for messages (coming soon)
- Parent portal (coming soon)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18.x or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NappyyCoder/Studdy_Buddy_Vercel.git
   cd Studdy_Buddy_Vercel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel (Recommended)

### Why Vercel?
✅ Automatic deployments on every push  
✅ Built-in database support (Postgres)  
✅ Environment variables for secure credentials  
✅ Free tier with generous limits  
✅ Perfect for Next.js applications  

### Deployment Steps

1. **Push your code to GitHub** (already done!)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Import Project"
   - Select `NappyyCoder/Studdy_Buddy_Vercel`
   - Click "Deploy"

3. **That's it!** Your site will be live at `https://studdy-buddy-vercel.vercel.app`

4. **Enable Auto-Deploy**
   - Every push to `main` → Automatic deployment
   - Every branch push → Preview deployment

### Add Database (Optional)

1. In Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → Select "Postgres"
3. Database credentials automatically added as environment variables
4. Access via `process.env.POSTGRES_URL`

**Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Deployment** | Vercel |
| **Database** | Vercel Postgres / Supabase |

---

## 📁 Project Structure

```
studdy-buddy-vercel/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   └── login/
│   ├── (dashboard)/         # Main application
│   │   ├── dashboard/       # Home dashboard
│   │   ├── courses/         # Course pages
│   │   │   ├── [id]/        # Dynamic course routes
│   │   │   │   ├── announcements/
│   │   │   │   ├── assignments/
│   │   │   │   ├── classlist/
│   │   │   │   ├── content/
│   │   │   │   └── grades/
│   │   ├── calendar/
│   │   ├── grades/
│   │   ├── bus/
│   │   ├── inbox/
│   │   └── account/
│   ├── api/                 # API routes (for database)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/              # Layout components
│   ├── navigation/          # Sidebar, nav items
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── constants/           # App constants
│   ├── types/               # TypeScript types
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── DEPLOYMENT.md            # Deployment guide
├── next.config.ts           # Next.js configuration
├── vercel.json              # Vercel configuration
└── package.json
```

---

## 🔄 Development Workflow

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   ```bash
   # Edit files...
   npm run dev  # Test locally
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Add my new feature"
   git push origin feature/my-new-feature
   ```

4. **Vercel automatically creates a preview URL**
   - Check the Vercel dashboard for the preview link
   - Test your changes before merging

5. **Merge to main**
   ```bash
   git checkout main
   git merge feature/my-new-feature
   git push origin main
   ```

6. **Vercel automatically deploys to production!**

---

## 🗺️ Roadmap

### Phase 1: Core UI ✅
- [x] Dashboard with course cards
- [x] Sidebar navigation
- [x] Course pages (home, content, grades, assignments)
- [x] Announcement system
- [x] Assignment submission UI
- [x] Bus tracking

### Phase 2: Backend Integration 🚧
- [ ] User authentication (students, teachers, parents)
- [ ] Database setup (Postgres/Supabase)
- [ ] API routes for CRUD operations
- [ ] Role-based access control

### Phase 3: Core Functionality 📋
- [ ] Assignment submission backend
- [ ] Grade book for teachers
- [ ] Announcement creation/management
- [ ] Calendar integration
- [ ] Email functionality

### Phase 4: Advanced Features 🎯
- [ ] Real-time notifications
- [ ] File upload/download
- [ ] Discussion boards
- [ ] Progress reports
- [ ] Parent portal
- [ ] Live bus tracking with GPS

### Phase 5: Polish & Launch 🚀
- [ ] Mobile optimization
- [ ] Accessibility (WCAG compliance)
- [ ] Performance optimization
- [ ] Documentation

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Create a pull request

---

## 📄 License

This project is currently private. License information will be added upon public release.

---

## 📧 Contact

For questions or suggestions, please open an issue on this repository.

---

## 🙏 Acknowledgments

Built with ❤️ by students, for students.

Special thanks to:
- Next.js team for the amazing framework
- Vercel for hosting and deployment
- shadcn for beautiful UI components

---

**StudyBuddy** — Simplifying academic life, one feature at a time 📚✨
