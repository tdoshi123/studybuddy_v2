# StudyBuddy

A modern Student Information System (SIS) designed specifically for K-12 students, teachers, and parents. StudyBuddy aims to simplify academic life by providing an intuitive platform to manage courses, assignments, grades, and communication—all in one place.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 🎯 Project Vision

StudyBuddy is being built to address the needs of K-12 schools looking for a clean, modern, and user-friendly student information system. Our goal is to create a platform that:

- **Students** can use to track assignments, view grades, and stay organized
- **Teachers** can use to manage classes, post assignments, and communicate with students
- **Parents** can use to monitor their child's academic progress

## ✨ Current Features

### Dashboard
- Course cards displaying enrolled classes (clickable to navigate to class)
- Responsive grid layout (2 columns on smaller screens, 3 on larger)
- To-Do list showing upcoming assignments and quizzes
- Clean, modern UI inspired by popular LMS platforms

### Navigation
- Fixed primary sidebar (72px) with icon-based navigation
- Sidebar items: Dashboard, Courses, Calendar, Grades, Bus, Inbox, Account
- Secondary overlay sidebar for course selection (appears when Courses is clicked)
- Smooth animations powered by Framer Motion

### Course Pages
- **Course List**: View all enrolled classes with teacher info
- **Course Layout**: Shared header and navigation across all course subpages
- **Course Home**: Recent announcements and upcoming work
- **Course Content**: 
  - Sidebar navigation with topics (Syllabus, Course Schedule, Table of Contents, etc.)
  - Document viewer for syllabus and course materials
  - Organized content by modules/units
- **Course Grades**:
  - Final calculated grade summary (Points and Grade percentage)
  - Detailed grades table with Name, Due, Status, Points, Grade, Comments columns
  - Status badges for LATE and MISSING assignments
  - Comment icons for assignments with teacher feedback
  - Full scrollable list of all assignments, quizzes, and exams
- **Course Classlist**:
  - View all students and instructors in the course
  - Tabbed navigation (All, Students, Instructors)
  - Search functionality to filter by name or email
  - Multi-select with checkboxes for bulk actions
  - Action buttons (Email, Instant Message, Print) with tooltip when no selection
  - Email compose modal with:
    - Recipients displayed as removable tags in To field
    - Cc and Bcc fields
    - Pre-filled subject line with course info
    - Rich text editor toolbar (formatting options)
    - Send and Cancel buttons
  - **Note:** Email sending functionality is currently incomplete (UI only, no backend integration)
- **Quick Actions**: Home, Content, Grades, Classlist, Course Tools
- **Course Tools Dropdown**: Announcements, Assignments, Attendance, Discussions, Groups, Quizzes, Surveys

### Bus Tracking
- Real-time bus status with on-time indicators
- Upcoming stops with estimated arrival times
- Bus details (driver, capacity, your stop)
- Weather and delay alerts

### Additional Pages (In Progress)
- Inbox for messages
- Grades overview (global)
- Calendar view
- Account settings

## 🗺️ Roadmap

### Phase 1: Core UI (Current)
- [x] Dashboard with course cards
- [x] Sidebar navigation system
- [x] Course list and detail pages
- [x] Course content page with sidebar navigation
- [x] Course grades page with calculated grades
- [x] Course classlist page with email compose modal (UI only)
- [x] To-Do list component
- [x] Bus tracking page
- [ ] Complete all placeholder pages

### Phase 2: Backend Integration
- [ ] User authentication (students, teachers, parents)
- [ ] Database setup (courses, assignments, grades)
- [ ] API routes for CRUD operations
- [ ] Role-based access control

### Phase 3: Core Functionality
- [ ] Assignment submission system
- [ ] Grade book for teachers
- [ ] Announcement/messaging system
- [ ] Calendar with event management
- [ ] Email integration for classlist (backend service needed)

### Phase 4: Advanced Features
- [ ] Real-time notifications
- [ ] File upload/download for assignments
- [ ] Discussion boards per class
- [ ] Progress reports and analytics
- [ ] Parent portal with student linking
- [ ] Live GPS bus tracking with map integration

### Phase 5: Polish & Launch
- [ ] Mobile responsive optimization
- [ ] Accessibility improvements (WCAG compliance)
- [ ] Performance optimization
- [ ] Documentation for schools

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tdoshi123/studybuddy_v2.git
   cd studybuddy_v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 📁 Project Structure

```
studybuddy/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Main app pages
│   │   ├── dashboard/       # Home dashboard
│   │   ├── courses/         # Course list and detail pages
│   │   │   ├── page.tsx     # All courses list
│   │   │   └── [id]/        # Individual course
│   │   │       ├── layout.tsx   # Course layout with nav
│   │   │       ├── page.tsx     # Course home
│   │   │       ├── content/     # Course content page
│   │   │       ├── grades/      # Course grades page
│   │   │       └── classlist/   # Course classlist page
│   │   ├── calendar/        # Calendar view
│   │   ├── grades/          # Grade overview
│   │   ├── bus/             # Bus tracking
│   │   ├── inbox/           # Messages
│   │   └── account/         # User settings
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with sidebar
│   └── page.tsx             # Redirects to dashboard
├── components/
│   ├── layout/              # Layout components
│   ├── navigation/          # Sidebar components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── constants/           # App constants (nav items, courses, config)
│   ├── types/               # TypeScript type definitions
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🤝 Contributing

We welcome contributions! If you'd like to help build StudyBuddy:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is currently private. License information will be added upon public release.

## 📧 Contact

For questions or suggestions, please open an issue on this repository.

---

**StudyBuddy** — For Students. Built by Students 📚
