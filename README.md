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

### Theme System
- **Light/Dark/System themes**: Full dark mode support across all pages
- **Theme persistence**: User preference saved to localStorage
- **System detection**: Automatically follows system preference when set to "System"
- **Smooth transitions**: No flash of incorrect theme on page load

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
- Full dark mode support for sidebars

### Calendar Page
- **Month View**: Full calendar grid with color-coded events
- **Week View**: Weekly schedule with hourly time slots (8 AM - 7 PM)
- **Day View**: Detailed daily view with events displayed at scheduled times
- **Agenda View**: List-based view of upcoming events grouped by date
- **Navigation**: Previous/Next month controls, Today button
- **Event Types**: Color-coded by category (classes, assignments, quizzes, exams, study groups, office hours)

### Grades Page (Global)
- **Stats Cards**: GPA, Total Credits, Average Grade, On Track indicator
- **Course Cards**: Expandable cards showing grade for each course
- **Grade Breakdown**: Category percentages (Assignments, Quizzes, Exams, Participation)
- **Recent Assignments**: List of recent graded work with scores
- **Grade Progress Bar**: Visual indicator of current grade
- **Filters**: Filter by grade (All, A, B, C, D/F)
- **Search**: Search courses by name or code

### Inbox Page
- **Message List**: All messages with sender info, subject, preview, and tags
- **Expandable Messages**: Click to expand and view full message content
- **Message Types**: Announcements, Teacher messages, Student messages
- **Filters**: Filter by All, Announcements, Teachers, Students
- **Search**: Search messages by sender, subject, or content
- **Stats Cards**: Unread counts by category
- **Attachments**: View attached files with name and size
- **Actions**: Reply, Forward, Archive, Delete buttons
- **Visual Indicators**: Unread badge, star, attachment icon

### Account Page
- **Profile Tab**:
  - Profile photo with upload/remove options
  - Personal information (Display Name, Student ID, Email, Phone)
  - Academic information (Major, Expected Graduation)
  - Save Changes button
- **Notifications Tab**:
  - Delivery methods (Email, Push notifications)
  - Notification types with toggles:
    - Course Announcements
    - Grade Updates
    - Assignment Reminders
    - Due Date Reminders
    - Messages
    - Calendar Reminders
- **Privacy & Safety Tab**:
  - Profile visibility (Everyone, Classmates Only, Private)
  - Contact info visibility (Email, Phone)
  - Activity status toggle
  - Messaging permissions
- **Preferences Tab**:
  - Theme selection (Light, Dark, System) - functional
  - Language selection
  - Date/Time format options
  - Accessibility options (Reduced Motion, High Contrast)

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
  - Multi-select with checkboxes for bulk actions (dark mode compatible)
  - Action buttons (Email, Instant Message, Print) with tooltip when no selection
  - Email compose modal with rich text editor
- **Course Announcements**:
  - View all course announcements with expandable cards
  - Filter options: All, Unread Only, Pinned Only (dropdown menu)
  - Search functionality to filter announcements
  - Visual indicators for Unread and Pinned status
  - Markdown rendering support
- **Course Assignments**:
  - List view of all course assignments
  - Displays due date, points, completion status, and comments indicator
  - Status badges: Submitted (green) or Not Submitted (red)
  - Clickable assignments link to detailed assignment pages
- **Assignment Detail Page**:
  - Assignment header with title, due date, and points
  - Full instructions section
  - Canvas-style tabbed submission interface:
    - **File Upload**: Drag & drop area with file picker
    - **Text Entry**: Rich text editor with formatting toolbar
    - **Website URL**: URL input field for link submissions
    - **Google Doc**: Connect to Google Drive option (placeholder)
    - **Media**: Record audio/video options (placeholder)
  - Comments field for submission notes
  - Submit Assignment button with confirmation
- **Quick Actions**: Home, Content, Grades, Classlist, Course Tools
- **Course Tools Dropdown**: Announcements, Assignments, Attendance, Discussions, Groups, Quizzes, Surveys

### Bus Tracking
- Real-time bus status with on-time indicators
- Upcoming stops with estimated arrival times
- Bus details (driver, capacity, your stop)
- Weather and delay alerts

## 🗺️ Roadmap

### Phase 1: Core UI (Complete)
- [x] Dashboard with course cards
- [x] Sidebar navigation system
- [x] Course list and detail pages
- [x] Course content page with sidebar navigation
- [x] Course grades page with calculated grades
- [x] Course classlist page with email compose modal
- [x] Course announcements page with filtering and search
- [x] Course assignments page with assignment list
- [x] Assignment detail page with Canvas-style submission UI
- [x] To-Do list component
- [x] Bus tracking page
- [x] Calendar page with Month/Week/Day/Agenda views
- [x] Global grades page with course breakdown
- [x] Inbox page with expandable messages
- [x] Account settings with all tabs
- [x] Theme system (Light/Dark/System)

### Phase 2: Backend Integration
- [ ] User authentication (students, teachers, parents)
- [ ] Database setup (courses, assignments, grades)
- [ ] API routes for CRUD operations
- [ ] Role-based access control

### Phase 3: Core Functionality
- [x] Assignment submission UI (Canvas-style tabbed interface)
- [ ] Assignment submission backend integration
- [ ] Grade book for teachers
- [x] Announcement viewing system (UI complete)
- [ ] Announcement creation/management for teachers
- [x] Calendar with multiple views (UI complete)
- [ ] Calendar event management backend
- [ ] Email integration for classlist

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
│   │   │       ├── classlist/   # Course classlist page
│   │   │       ├── announcements/  # Course announcements page
│   │   │       └── assignments/    # Course assignments
│   │   │           ├── page.tsx        # Assignments list
│   │   │           └── [assignmentId]/ # Assignment detail page
│   │   ├── calendar/        # Calendar view (Month/Week/Day/Agenda)
│   │   ├── grades/          # Global grade overview
│   │   ├── bus/             # Bus tracking
│   │   ├── inbox/           # Messages with expandable content
│   │   └── account/         # User settings (Profile/Notifications/Privacy/Preferences)
│   ├── globals.css          # Global styles + dark mode
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Redirects to dashboard
├── components/
│   ├── layout/              # Layout components
│   ├── navigation/          # Sidebar components
│   ├── theme/               # Theme provider and hooks
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
