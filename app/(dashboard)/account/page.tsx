"use client";

import { useState } from "react";
import { User, Bell, Users, Settings, Upload, Mail, Phone, Moon, Sun, Monitor, Globe, Clock, Eye, EyeOff, MessageSquare, BookOpen, GraduationCap, Calendar, Megaphone } from "lucide-react";
import { useTheme } from "@/components/theme";

type TabType = "profile" | "notifications" | "privacy" | "preferences";

const TABS = [
  { id: "profile" as TabType, label: "Profile", icon: User },
  { id: "notifications" as TabType, label: "Notifications", icon: Bell },
  { id: "privacy" as TabType, label: "Privacy & Safety", icon: Users },
  { id: "preferences" as TabType, label: "Preferences", icon: Settings },
];

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#6E8CB9]" : "bg-gray-200 dark:bg-gray-700"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Profile state
  const [displayName, setDisplayName] = useState("Alex Johnson");
  const [studentId] = useState("STU-2026-5678");
  const [email] = useState("alex.johnson@student.k12.edu");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [grade, setGrade] = useState("5th Grade");
  const [homeroom, setHomeroom] = useState("Mrs. Anderson - Room 204");

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = useState(true);
  const [gradeUpdates, setGradeUpdates] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [calendarReminders, setCalendarReminders] = useState(true);

  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState<"everyone" | "classmates" | "private">("classmates");
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [allowMessages, setAllowMessages] = useState<"everyone" | "classmates" | "none">("classmates");

  // Preferences state
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your profile, notifications, and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex gap-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-[#6E8CB9] text-[#6E8CB9]"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your personal information and profile photo
              </p>
            </div>

            {/* Profile Photo Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#6E8CB9] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Photo
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Click on the avatar to upload a new photo. Recommended size: 400x400px
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors text-sm">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* School Information Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                School Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={grade}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Homeroom Teacher
                  </label>
                  <input
                    type="text"
                    value={homeroom}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control how and when you receive notifications
              </p>
            </div>

            {/* Delivery Methods */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Delivery Methods
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={pushNotifications} onChange={setPushNotifications} />
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Notification Types
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Class Announcements</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Updates from your teachers</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={courseAnnouncements} onChange={setCourseAnnouncements} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Grade Updates</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">When grades are posted or updated</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={gradeUpdates} onChange={setGradeUpdates} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Assignment Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">New assignments and updates</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={assignmentReminders} onChange={setAssignmentReminders} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Due Date Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reminders before assignments are due</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={dueDateReminders} onChange={setDueDateReminders} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Messages</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Messages from classmates and teachers</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={messageNotifications} onChange={setMessageNotifications} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Calendar Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming events and schedule changes</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={calendarReminders} onChange={setCalendarReminders} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Safety Tab */}
      {activeTab === "privacy" && (
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy & Safety
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control who can see your information and contact you
              </p>
            </div>

            {/* Profile Visibility */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Profile Visibility
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Who can see your profile?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "everyone", label: "Everyone", desc: "Anyone at your school can view your profile" },
                      { value: "classmates", label: "Classmates Only", desc: "Only students in your classes can view your profile" },
                      { value: "private", label: "Private", desc: "Only you can see your full profile" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${profileVisibility === option.value
                            ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                      >
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option.value}
                          checked={profileVisibility === option.value}
                          onChange={(e) => setProfileVisibility(e.target.value as typeof profileVisibility)}
                          className="mt-1 text-[#6E8CB9] focus:ring-[#6E8CB9]"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Contact Information Visibility
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {showEmail ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Show Email Address</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your email</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={showEmail} onChange={setShowEmail} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    {showPhone ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Show Phone Number</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your phone number</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={showPhone} onChange={setShowPhone} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activityStatus ? "bg-green-500" : "bg-gray-400"}`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Activity Status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show when you&apos;re online</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={activityStatus} onChange={setActivityStatus} />
                </div>
              </div>
            </div>

            {/* Messaging */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Messaging
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Who can send you messages?
                </label>
                <div className="space-y-2">
                  {[
                    { value: "everyone", label: "Everyone", desc: "Anyone at your school can message you" },
                    { value: "classmates", label: "Classmates Only", desc: "Only students in your classes can message you" },
                    { value: "none", label: "No One", desc: "Disable direct messages (teachers can still contact you)" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${allowMessages === option.value
                          ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      <input
                        type="radio"
                        name="allowMessages"
                        value={option.value}
                        checked={allowMessages === option.value}
                        onChange={(e) => setAllowMessages(e.target.value as typeof allowMessages)}
                        className="mt-1 text-[#6E8CB9] focus:ring-[#6E8CB9]"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customize your app experience
              </p>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Appearance
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as typeof theme)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${theme === option.value
                            ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                      >
                        <Icon className={`w-6 h-6 ${theme === option.value ? "text-[#6E8CB9]" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${theme === option.value ? "text-[#6E8CB9]" : "text-gray-700 dark:text-gray-300"}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Language & Region */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Language & Region
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none appearance-none"
                    >
                      <option value="en">English (US)</option>
                      <option value="en-gb">English (UK)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none appearance-none"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Format
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none appearance-none"
                    >
                      <option value="12h">12-hour (1:00 PM)</option>
                      <option value="24h">24-hour (13:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Accessibility
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Reduced Motion</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Minimize animations throughout the app</p>
                  </div>
                  <ToggleSwitch enabled={reducedMotion} onChange={setReducedMotion} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">High Contrast</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better visibility</p>
                  </div>
                  <ToggleSwitch enabled={highContrast} onChange={setHighContrast} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
