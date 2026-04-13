"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { User, Users, GraduationCap, Shield, CheckCircle2 } from "lucide-react";

const ROLE_HOME: Record<string, string> = {
  student: "/lis/student/dashboard",
  parent: "/sis/parent/dashboard",
  teacher: "/lis/teacher/dashboard",
  admin: "/sis/admin",
};

const ROLES = [
  {
    id: "student",
    label: "Student",
    description: "Access your courses, grades, and assignments",
    icon: User,
    color: "#1e3a8a",
  },
  {
    id: "parent",
    label: "Parent",
    description: "Monitor your children's academic progress",
    icon: Users,
    color: "#166534",
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Manage courses, grade assignments, and track students",
    icon: GraduationCap,
    color: "#7c3aed",
  },
  {
    id: "admin",
    label: "Administrator",
    description: "Manage school-wide settings and users",
    icon: Shield,
    color: "#b45309",
  },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  // Pre-select whatever role is already stored in Clerk
  const existingRole = (user?.unsafeMetadata?.role as string) ?? null;
  const [selectedRole, setSelectedRole] = useState<string | null>(existingRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isChangingRole = !!existingRole;

  const handleContinue = async () => {
    if (!selectedRole || !user) return;
    setLoading(true);
    setError(null);

    try {
      await user.update({
        unsafeMetadata: { role: selectedRole },
      });
      const href = ROLE_HOME[selectedRole] ?? "/dashboard";
      router.push(href);
      router.refresh();
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isChangingRole ? "Switch Role" : "Welcome to StudyBuddy"}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {isChangingRole
              ? `Currently signed in as ${existingRole}. Select a different role below.`
              : "Select your role to get started"}
          </p>
        </div>

        {/* Role grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isCurrent = existingRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-[#1e3a8a] bg-blue-50 dark:bg-blue-950/30 shadow-md"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${role.color}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color: role.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {role.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-blue-400 dark:bg-blue-950/40">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    {role.description}
                  </p>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <CheckCircle2
                    className="absolute top-3 right-3 w-5 h-5 text-[#1e3a8a]"
                    fill="currentColor"
                    fillOpacity={0.15}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading || selectedRole === existingRole}
          className="w-full py-4 bg-[#1e3a8a] text-white font-semibold rounded-xl hover:bg-[#1e293b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-base"
        >
          {loading
            ? "Saving…"
            : isChangingRole && selectedRole !== existingRole
            ? `Switch to ${ROLES.find((r) => r.id === selectedRole)?.label}`
            : selectedRole === existingRole
            ? "Already set — select a different role"
            : `Continue as ${ROLES.find((r) => r.id === selectedRole)?.label ?? "…"}`}
        </button>

        {/* Skip link if role already set */}
        {isChangingRole && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Cancel — keep my current role ({existingRole})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
