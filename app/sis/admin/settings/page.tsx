"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Bell, Shield, Save, User, Monitor, Sun, Moon,
  CheckCircle2, Camera, Key, RefreshCw, LogOut,
} from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SectionCard({ id, icon: Icon, title, description, children }: {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden scroll-mt-6">
      <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
          {description && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-7 py-4 border-b border-gray-50 dark:border-slate-800/60 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const NAV_SECTIONS = [
  { id: "profile",       label: "Profile",        icon: User },
  { id: "appearance",    label: "Appearance",      icon: Sun },
  { id: "notifications", label: "Notifications",   icon: Bell },
  { id: "security",      label: "Security",        icon: Shield },
];

export default function AdminSettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const currentRole = (user?.unsafeMetadata?.role as string) ?? null;
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    gradeUpdates:       true,
    attendanceAlerts:   true,
    teacherMessages:    true,
    schoolAnnouncements: true,
    reportCards:        true,
    systemUpdates:      false,
  });

  const [preferences, setPreferences] = useState({
    language: "English",
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function scrollTo(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const THEME_OPTIONS: { value: "light" | "dark" | "system"; label: string; icon: React.ElementType; desc: string }[] = [
    { value: "light",  label: "Light",  icon: Sun,     desc: "Always light" },
    { value: "dark",   label: "Dark",   icon: Moon,    desc: "Always dark" },
    { value: "system", label: "System", icon: Monitor, desc: "Follow device" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your profile, notifications, and preferences.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {currentRole && (
            <Link
              href="/onboarding"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Switch role
              <span className="text-xs font-semibold text-[#1e3a8a] dark:text-blue-400 capitalize">
                ({currentRole})
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={save}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              saved ? "bg-emerald-600 text-white" : "bg-[#1e3a8a] hover:bg-blue-700 text-white"
            }`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0 self-stretch hidden lg:block">
          <aside className="sticky top-6">
            <nav className="space-y-0.5">
              {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeSection === id
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${activeSection === id ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}`} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Log out */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </aside>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile */}
          <SectionCard id="profile" icon={User} title="Profile" description="Your name and contact information">
            <div className="flex items-center gap-5 px-7 py-6 border-b border-gray-50 dark:border-slate-800/60">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-[#1e3a8a] flex items-center justify-center text-white text-2xl font-bold select-none">
                  {user?.firstName?.[0] ?? "A"}{user?.lastName?.[0] ?? ""}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  title="Change photo"
                >
                  <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.fullName ?? "Admin"}</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-0.5">{user?.primaryEmailAddress?.emailAddress ?? "admin@email.com"}</p>
                <span className="inline-block mt-2 text-[11px] font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full uppercase tracking-wide">
                  Administrator
                </span>
              </div>
            </div>

            <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>First Name</FieldLabel>
                <input defaultValue={user?.firstName ?? ""} className={inputCls} placeholder="First name" />
              </div>
              <div>
                <FieldLabel>Last Name</FieldLabel>
                <input defaultValue={user?.lastName ?? ""} className={inputCls} placeholder="Last name" />
              </div>
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <input defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""} className={inputCls} placeholder="your@email.com" />
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <input defaultValue="" className={inputCls} placeholder="+1 (555) 000-0000" type="tel" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Language</FieldLabel>
                <select
                  value={preferences.language}
                  onChange={e => setPreferences(p => ({ ...p, language: e.target.value }))}
                  className={inputCls}
                >
                  <option>English</option>
                  <option>Filipino</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Appearance */}
          <SectionCard id="appearance" icon={resolvedTheme === "dark" ? Moon : Sun} title="Appearance" description="Control how StudyBuddy looks">
            <div className="px-7 py-6">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Color Theme</p>
              <div className="grid grid-cols-3 gap-4">
                {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
                  const active = theme === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all group ${
                        active
                          ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md"
                          : "border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                      }`}
                    >
                      {active && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        active ? "bg-blue-600 shadow-lg shadow-blue-600/30" : "bg-white dark:bg-slate-700 group-hover:bg-blue-50 dark:group-hover:bg-slate-600"
                      }`}>
                        <Icon className={`w-6 h-6 ${active ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${active ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>{label}</p>
                        <p className={`text-xs mt-0.5 ${active ? "text-blue-500 dark:text-blue-500" : "text-gray-400 dark:text-slate-500"}`}>{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard id="notifications" icon={Bell} title="Notifications" description="Choose which events trigger a notification">
            {([
              { key: "gradeUpdates",        label: "Grade updates",          desc: "When new grades or report cards are posted" },
              { key: "attendanceAlerts",    label: "Attendance alerts",      desc: "When students are marked absent or tardy" },
              { key: "teacherMessages",     label: "Teacher messages",       desc: "Direct messages from teachers" },
              { key: "schoolAnnouncements", label: "School announcements",   desc: "News and updates from the school" },
              { key: "reportCards",         label: "Report cards",           desc: "When quarterly report cards are available" },
              { key: "systemUpdates",       label: "Platform updates",       desc: "StudyBuddy announcements and new features" },
            ] as const).map(({ key, label, desc }) => (
              <SettingRow key={key} label={label} description={desc}>
                <Toggle
                  checked={notifications[key]}
                  onChange={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                />
              </SettingRow>
            ))}
          </SectionCard>

          {/* Security */}
          <SectionCard id="security" icon={Shield} title="Security" description="Manage your password and account access">
            <div className="px-7 py-6 space-y-4">
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Key className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Password</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Last updated: managed by Clerk</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex-shrink-0 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  Change
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Password management and multi-factor authentication are handled securely via Clerk.
              </p>
            </div>
          </SectionCard>

          {/* Footer */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-gray-400 dark:text-slate-500">Changes are saved to your account profile.</p>
            <button
              type="button"
              onClick={save}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                saved ? "bg-emerald-600 text-white" : "bg-[#1e3a8a] hover:bg-blue-700 text-white"
              }`}
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
