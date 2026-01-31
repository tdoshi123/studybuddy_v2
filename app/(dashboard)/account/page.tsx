"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Camera,
  Mail,
  Phone,
  GraduationCap,
  Lock,
  Smartphone,
  Monitor,
  Globe,
  Accessibility,
  Sun,
  Moon,
  Laptop,
  Eye,
  EyeOff,
  Upload,
  Check,
  UtensilsCrossed,
  Wallet,
  UserX,
  Calendar,
  X,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

type Section = "profile" | "campus" | "security" | "notifications" | "privacy" | "preferences";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const { theme, setTheme } = useTheme();
  
  // Form states
  const [displayName, setDisplayName] = useState("John Smith");
  const [email, setEmail] = useState("john.smith@university.edu");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [studentId] = useState("STU-2024-1234");
  const [major] = useState("Computer Science");
  const [graduationYear] = useState("2027");
  
  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [gradeUpdates, setGradeUpdates] = useState(true);
  const [courseAnnouncements, setCourseAnnouncements] = useState(true);
  const [studyGroupInvites, setStudyGroupInvites] = useState(true);
  
  // Preference states - removed local theme state, now using useTheme
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [defaultCalendarView, setDefaultCalendarView] = useState("week");
  
  // Campus services states
  const [diningDollars] = useState(247.50);
  const [mealSwipes] = useState(12);
  const [autoReloadDining, setAutoReloadDining] = useState(false);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  
  // Privacy states
  const [profileVisibility, setProfileVisibility] = useState("friends");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowStudyGroupInvites, setAllowStudyGroupInvites] = useState(true);

  const navigationItems = [
    { id: "profile" as Section, label: "Profile", icon: User },
    { id: "campus" as Section, label: "Campus Services", icon: UtensilsCrossed },
    { id: "security" as Section, label: "Security", icon: Shield },
    { id: "notifications" as Section, label: "Notifications", icon: Bell },
    { id: "privacy" as Section, label: "Privacy & Safety", icon: UserX },
    { id: "preferences" as Section, label: "Preferences", icon: Palette },
  ];

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro",
      location: "Campus Library",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 15 Pro",
      location: "Student Union",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Windows",
      location: "Dorm Room",
      lastActive: "Yesterday",
      current: false,
    },
  ];

  const blockedUsers = [
    { id: 1, name: "Sarah Johnson", username: "@sjohnson", blockedDate: "Jan 15, 2026", reason: "Spam" },
    { id: 2, name: "Mike Chen", username: "@mchen", blockedDate: "Dec 28, 2025", reason: "Harassment" },
  ];

  const diningHistory = [
    { id: 1, date: "Jan 30, 2026", location: "Student Union Cafe", amount: "$12.50", type: "Dining Dollars" },
    { id: 2, date: "Jan 29, 2026", location: "Main Dining Hall", amount: "1 Swipe", type: "Meal Plan" },
    { id: 3, date: "Jan 28, 2026", location: "Coffee Shop", amount: "$5.75", type: "Dining Dollars" },
    { id: 4, date: "Jan 27, 2026", location: "Campus Market", amount: "$8.25", type: "Dining Dollars" },
  ];

  const handleAvatarUpload = () => {
    console.log("Avatar upload triggered");
  };

  const handleSaveProfile = () => {
    console.log("Profile saved", { displayName, email, phone, studentId });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Password changed");
  };

  const handleLogoutOtherSessions = (sessionId: number) => {
    console.log("Logging out session:", sessionId);
  };

  const handleUnblockUser = (userId: number) => {
    console.log("Unblocking user:", userId);
  };

  const handleAddDiningFunds = () => {
    console.log("Add dining funds triggered");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header with Tab Navigation */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your profile, security, and campus services
            </p>
          </div>

          {/* Horizontal Tab Navigation */}
          <nav
            className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px"
            role="tablist"
            aria-label="Account settings sections"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${item.id}-panel`}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    border-b-2 transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? "border-[#6E8CB9] text-[#6E8CB9]"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6" role="tabpanel" id="profile-panel" aria-labelledby="profile-tab">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information and profile photo
                </p>
              </div>

              {/* Avatar Section */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-start gap-6 flex-col sm:flex-row">
                  <div className="relative group">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="" alt="Profile picture" />
                      <AvatarFallback className="text-2xl">JS</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Change profile picture"
                    >
                      <Camera className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Photo
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Click on the avatar to upload a new photo. Recommended size: 400x400px
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button size="sm" onClick={handleAvatarUpload}>
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        Upload Photo
                      </Button>
                      <Button size="sm" variant="outline">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName" className="text-gray-700 dark:text-gray-300">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId" className="text-gray-700 dark:text-gray-300">
                      Student ID
                    </Label>
                    <Input
                      id="studentId"
                      type="text"
                      value={studentId}
                      className="mt-1.5"
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                      className="mt-1.5"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      icon={<Phone className="w-4 h-4" />}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="major" className="text-gray-700 dark:text-gray-300">
                      Major
                    </Label>
                    <Input
                      id="major"
                      type="text"
                      value={major}
                      icon={<GraduationCap className="w-4 h-4" />}
                      className="mt-1.5"
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduationYear" className="text-gray-700 dark:text-gray-300">
                      Expected Graduation
                    </Label>
                    <Input
                      id="graduationYear"
                      type="text"
                      value={`May ${graduationYear}`}
                      icon={<Calendar className="w-4 h-4" />}
                      className="mt-1.5"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  To update academic information, please visit the Registrar's Office
                </p>
              </div>

              {/* Connected Accounts */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Connected Accounts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Google</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          john.smith@gmail.com
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Microsoft</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Not connected
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>
                  <Check className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Campus Services Section */}
          {activeSection === "campus" && (
            <div className="space-y-6" role="tabpanel" id="campus-panel">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Campus Services
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your dining dollars, meal plan, and campus accounts
                </p>
              </div>

              {/* Dining Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dining Dollars Card */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Dining Dollars</p>
                    <p className="text-4xl font-bold">${diningDollars.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={handleAddDiningFunds}
                  >
                    <Plus className="w-4 h-4" />
                    Add Funds
                  </Button>
                </div>

                {/* Meal Swipes Card */}
                <div className="bg-gradient-to-br from-[#6E8CB9] to-[#5F7AA3] rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      This Week
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Meal Swipes Remaining</p>
                    <p className="text-4xl font-bold">{mealSwipes}</p>
                    <p className="text-sm text-white/70 mt-2">Resets every Sunday</p>
                  </div>
                </div>
              </div>

              {/* Dining Settings */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dining Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-900 dark:text-white font-medium">
                        Auto-Reload Dining Dollars
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically add $50 when balance drops below $25
                      </p>
                    </div>
                    <Switch
                      checked={autoReloadDining}
                      onCheckedChange={setAutoReloadDining}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-900 dark:text-white font-medium">
                        Low Balance Alerts
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when dining dollars are running low
                      </p>
                    </div>
                    <Switch
                      checked={lowBalanceAlert}
                      onCheckedChange={setLowBalanceAlert}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Dining Transactions */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {diningHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "Dining Dollars"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}>
                          {transaction.type === "Dining Dollars" ? (
                            <Wallet className={`w-5 h-5 ${
                              transaction.type === "Dining Dollars"
                                ? "text-green-600 dark:text-green-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`} />
                          ) : (
                            <UtensilsCrossed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.location}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transaction.amount}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Clock className="w-4 h-4" />
                  View All Transactions
                </Button>
              </div>

              {/* Campus Statistics */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  This Month's Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$156.75</p>
                    <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400 text-sm">
                      <TrendingUp className="w-3 h-3" />
                      <span>12% less than last month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Visits</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Avg: $6.81 per visit
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Favorite Spot</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      Student Union
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      9 visits this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="space-y-6" role="tabpanel" id="security-panel">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your password and security preferences
                </p>
              </div>

              {/* Change Password */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
                      Current Password
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        icon={<Lock className="w-4 h-4" />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                      className="mt-1.5"
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="w-full sm:w-auto">
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </h3>
                      {twoFactorEnabled && <Badge variant="success">Enabled</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Authenticator App Connected
                        </p>
                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                          Use your authenticator app to generate verification codes
                        </p>
                        <Button size="sm" variant="outline" className="mt-3">
                          View Backup Codes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Sessions */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Active Sessions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Manage devices where you're currently logged in
                </p>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {session.device}
                            </p>
                            {session.current && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.location}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLogoutOtherSessions(session.id)}
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="destructive" className="w-full sm:w-auto mt-4">
                  Logout All Other Sessions
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div className="space-y-6" role="tabpanel" id="notifications-panel">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Preferences
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose how and when you want to be notified
                </p>
              </div>

              {/* Email Notifications */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Email Notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                {emailNotifications && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Assignment Reminders
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get reminded about upcoming assignment deadlines
                          </p>
                        </div>
                        <Switch
                          checked={assignmentReminders}
                          onCheckedChange={setAssignmentReminders}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Grade Updates
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notify me when grades are posted
                          </p>
                        </div>
                        <Switch
                          checked={gradeUpdates}
                          onCheckedChange={setGradeUpdates}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Course Announcements
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive important course announcements
                          </p>
                        </div>
                        <Switch
                          checked={courseAnnouncements}
                          onCheckedChange={setCourseAnnouncements}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-white font-medium">
                            Study Group Invites
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified when added to study groups
                          </p>
                        </div>
                        <Switch
                          checked={studyGroupInvites}
                          onCheckedChange={setStudyGroupInvites}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Push Notifications */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Push Notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>

              {/* Notification Schedule */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Schedule
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Set quiet hours when you don't want to be disturbed
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quietStart" className="text-gray-700 dark:text-gray-300">
                      Quiet Hours Start
                    </Label>
                    <Select defaultValue="22:00">
                      <SelectTrigger id="quietStart" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quietEnd" className="text-gray-700 dark:text-gray-300">
                      Quiet Hours End
                    </Label>
                    <Select defaultValue="08:00">
                      <SelectTrigger id="quietEnd" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Default</Button>
                <Button>
                  <Check className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* Privacy & Safety Section */}
          {activeSection === "privacy" && (
            <div className="space-y-6" role="tabpanel" id="privacy-panel">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy & Safety
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Control who can see your information and interact with you
                </p>
              </div>

              {/* Profile Visibility */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Visibility
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileVisibility" className="text-gray-700 dark:text-gray-300">
                      Who can see your profile?
                    </Label>
                    <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                      <SelectTrigger id="profileVisibility" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="classmates">Classmates Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Control who can view your profile information
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-900 dark:text-white font-medium">
                        Show Online Status
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let others know when you're online
                      </p>
                    </div>
                    <Switch
                      checked={showOnlineStatus}
                      onCheckedChange={setShowOnlineStatus}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-900 dark:text-white font-medium">
                        Allow Study Group Invites
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let classmates invite you to study groups
                      </p>
                    </div>
                    <Switch
                      checked={allowStudyGroupInvites}
                      onCheckedChange={setAllowStudyGroupInvites}
                    />
                  </div>
                </div>
              </div>

              {/* Blocked Users */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Blocked Users
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Users you've blocked won't be able to message you or see your activity
                </p>
                {blockedUsers.length > 0 ? (
                  <div className="space-y-3">
                    {blockedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {user.username}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="destructive" className="text-xs">
                                {user.reason}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                Blocked {user.blockedDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockUser(user.id)}
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserX className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No blocked users
                    </p>
                  </div>
                )}
              </div>

              {/* Data & Privacy */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Data & Privacy
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex-1 text-left">Download My Data</span>
                    <Badge variant="secondary">GDPR</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <span className="flex-1 text-left">Privacy Policy</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    <span className="flex-1 text-left">Delete Account</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeSection === "preferences" && (
            <div className="space-y-6" role="tabpanel" id="preferences-panel">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance & Accessibility
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Customize how Study Buddy looks and works for you
                </p>
              </div>

              {/* Theme Settings */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Theme
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Choose your preferred color scheme
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        theme === "light"
                          ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }
                    `}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-gray-900 dark:text-white" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        theme === "dark"
                          ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }
                    `}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-gray-900 dark:text-white" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${
                        theme === "system"
                          ? "border-[#6E8CB9] bg-[#6E8CB9]/5"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }
                    `}
                  >
                    <Laptop className="w-6 h-6 mx-auto mb-2 text-gray-900 dark:text-white" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">System</p>
                  </button>
                </div>
              </div>

              {/* Language Settings */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Language & Region
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">
                      Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* App Preferences */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  App Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calendarView" className="text-gray-700 dark:text-gray-300">
                      Default Calendar View
                    </Label>
                    <Select value={defaultCalendarView} onValueChange={setDefaultCalendarView}>
                      <SelectTrigger id="calendarView" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day View</SelectItem>
                        <SelectItem value="week">Week View</SelectItem>
                        <SelectItem value="month">Month View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Accessibility Settings */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Accessibility
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fontSize" className="text-gray-700 dark:text-gray-300">
                      Font Size
                    </Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="fontSize" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="xlarge">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label className="text-gray-900 dark:text-white font-medium">
                        Reduce Motion
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch
                      checked={reduceMotion}
                      onCheckedChange={setReduceMotion}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Default</Button>
                <Button>
                  <Check className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
