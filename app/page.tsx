"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GraduationCap, Users, ArrowRight, BookOpen, Calendar, TrendingUp, Shield, ClipboardCheck } from "lucide-react";
export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Content */}
      <div>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16 sm:mb-20 animate-fade-in-down">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Welcome to StudyBuddy
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Your complete student information system for managing courses, grades, and academic progress
            </p>
          </div>

          {/* Login Cards */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 animate-fade-in-up">
            {/* Student Login Card */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Student Portal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Access your courses, grades, assignments, and collaborate with classmates
                </p>
                <Link
                  href="/sign-in"
                  className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e293b] transition-all duration-300 font-semibold shadow-lg"
                >
                  Sign In as Student
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
                <div className="mt-4 text-center">
                  <Link
                    href="/sign-up"
                    className="text-sm text-[#1e3a8a] hover:text-[#1e293b] font-semibold transition-colors duration-200"
                  >
                    Create Student Account →
                  </Link>
                </div>
              </div>
            </div>

            {/* Parent Login Card */}
            <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Parent Portal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Monitor your children's academic progress, attendance, and stay informed
                </p>
                <Link
                  href="/sign-in"
                  className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  Sign In as Parent
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
                <div className="mt-4 text-center">
                  <Link
                    href="/sign-up"
                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200"
                  >
                    Create Parent Account →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Password Reset */}
          <div className="text-center mb-20 animate-fade-in">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
            >
              <span>Forgot your password?</span>
              <span className="text-[#1e3a8a] hover:text-[#1e293b] font-semibold group-hover:underline">Reset it here</span>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Everything you need to succeed
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Course Management",
                  description: "Access all your courses, materials, and assignments in one centralized platform",
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  icon: Calendar,
                  title: "Smart Calendar",
                  description: "Stay organized with AI-powered scheduling for assignments, quizzes, and events",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: TrendingUp,
                  title: "Grade Analytics",
                  description: "Track your academic progress with detailed analytics and performance insights",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: ClipboardCheck,
                  title: "Assignment Tracker",
                  description: "Track due dates, submit work, and never miss an assignment or quiz",
                  gradient: "from-amber-500 to-orange-500",
                },
                {
                  icon: Users,
                  title: "Collaboration Tools",
                  description: "Connect with classmates, form study groups, and share knowledge",
                  gradient: "from-cyan-500 to-blue-500",
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Enterprise-grade security to protect your educational data",
                  gradient: "from-red-500 to-rose-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 StudyBuddy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
