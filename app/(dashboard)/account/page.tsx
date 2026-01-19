import { Camera, Mail, Phone, MapPin, GraduationCap, Calendar } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your profile and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#6E8CB9] flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">JS</span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Name & Role */}
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                John Smith
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Computer Science Major
              </p>

              {/* Student ID */}
              <div className="mt-4 px-3 py-1 bg-[#6E8CB9]/10 rounded-full">
                <span className="text-sm font-medium text-[#6E8CB9]">
                  ID: STU-2024-1234
                </span>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 w-full grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    3.75
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">GPA</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    68
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Credits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Smith"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="March 15, 2004"
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    defaultValue="john.smith@university.edu"
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="123 Campus Drive, University City, CA 90210"
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Major
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="Computer Science"
                    className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                    readOnly
                  />
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Minor
                </label>
                <input
                  type="text"
                  defaultValue="Mathematics"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  defaultValue="Junior (3rd Year)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Expected Graduation
                </label>
                <input
                  type="text"
                  defaultValue="May 2027"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent outline-none transition-all"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

