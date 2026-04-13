"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  School,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Users,
  Calendar,
  AlertCircle,
  ExternalLink,
  X,
} from "lucide-react";

interface StaffMember {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface SchoolInfo {
  name: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  principal: string;
  principalEmail: string;
  hours: string;
  officeHours: string;
  enrollment: string;
  gradeRange: string;
  mascot: string;
  colors: string;
  district: string;
  staff: StaffMember[];
  importantDates: { date: string; event: string }[];
  announcements: { title: string; body: string; date: string; urgent: boolean }[];
}

const ALEX_SCHOOL: SchoolInfo = {
  name: "Westfield Elementary School",
  address: "425 Maple Avenue, Springfield, IL 62704",
  phone: "(217) 555-0142",
  fax: "(217) 555-0143",
  email: "office@westfield.springfield.k12.us",
  website: "www.westfield.springfield.k12.us",
  principal: "Dr. Margaret Sullivan",
  principalEmail: "msullivan@westfield.springfield.k12.us",
  hours: "8:00 AM – 3:15 PM",
  officeHours: "7:30 AM – 4:00 PM",
  enrollment: "487 students",
  gradeRange: "K–5",
  mascot: "Wildcats",
  colors: "Navy Blue & Gold",
  district: "Springfield School District 186",
  staff: [
    { name: "Dr. Margaret Sullivan", role: "Principal", email: "msullivan@westfield.springfield.k12.us", phone: "(217) 555-0142 ext. 100" },
    { name: "Mr. James Whitaker", role: "Assistant Principal", email: "jwhitaker@westfield.springfield.k12.us", phone: "(217) 555-0142 ext. 101" },
    { name: "Mrs. Patricia Gomez", role: "School Counselor", email: "pgomez@westfield.springfield.k12.us", phone: "(217) 555-0142 ext. 110" },
    { name: "Nurse Linda Park", role: "School Nurse", email: "lpark@westfield.springfield.k12.us", phone: "(217) 555-0142 ext. 115" },
    { name: "Mrs. Donna Tran", role: "Front Office", email: "dtran@westfield.springfield.k12.us", phone: "(217) 555-0142 ext. 102" },
  ],
  importantDates: [
    { date: "Apr 14–18", event: "Spring Break — No School" },
    { date: "Apr 25", event: "Spring Art Show (6:00 PM, Gymnasium)" },
    { date: "May 2", event: "Teacher Appreciation Day" },
    { date: "May 9", event: "5th Grade Field Day" },
    { date: "May 16", event: "Spring Band Concert (7:00 PM)" },
    { date: "May 23", event: "Early Release Day (12:30 PM)" },
    { date: "May 30", event: "Memorial Day — No School" },
    { date: "Jun 6", event: "Last Day of School (Early Release)" },
  ],
  announcements: [
    { title: "Spring Picture Day", body: "Spring pictures will be taken on April 22. Order forms were sent home — online ordering is also available through the school website.", date: "Apr 8, 2026", urgent: false },
    { title: "Parking Lot Construction", body: "The south parking lot will be closed for resurfacing April 20–24. Please use the north entrance for drop-off and pick-up during this time.", date: "Apr 5, 2026", urgent: true },
    { title: "Summer Camp Registration Open", body: "Registration for Westfield Summer Enrichment Camp (June 15 – July 24) is now open. Visit the school website to register.", date: "Mar 28, 2026", urgent: false },
  ],
};


export default function SchoolInformationPage() {
  const school = ALEX_SCHOOL;
  const [openAnnouncement, setOpenAnnouncement] = useState<(typeof school.announcements)[number] | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/40">
          <School className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">School Information</h1>
      </div>

      {/* School Announcements */}
      {school.announcements.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">School Announcements</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {school.announcements.map((a, i) => (
              <button key={i} onClick={() => setOpenAnnouncement(a)} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors text-left">
                {a.urgent && <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
                <span className={`text-xs font-semibold flex-shrink-0 ${a.urgent ? "text-amber-700 dark:text-amber-300" : "text-gray-900 dark:text-white"}`}>{a.title}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{a.body}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">{a.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School details card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">School Details</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{school.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{school.district}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{school.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{school.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{school.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <span className="text-sm text-[#1e3a8a] dark:text-blue-400 font-medium flex items-center gap-1">
                  {school.website}
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">School Hours</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.hours}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Office Hours</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.officeHours}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Grades</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.gradeRange}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Enrollment</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.enrollment}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mascot</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.mascot}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Colors</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{school.colors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key staff card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Key Staff</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {school.staff.map((member, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1e3a8a]/10 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className="ml-12 mt-1.5 space-y-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {member.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important dates */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Upcoming Dates</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {school.importantDates.map((d, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-2.5 w-28 flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm font-bold text-[#1e3a8a] dark:text-blue-400">{d.date}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{d.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement modal */}
      {openAnnouncement && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenAnnouncement(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 min-w-0">
                {openAnnouncement.urgent && <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
                <p className={`text-sm font-semibold truncate ${openAnnouncement.urgent ? "text-amber-800 dark:text-amber-300" : "text-gray-900 dark:text-white"}`}>
                  {openAnnouncement.title}
                </p>
              </div>
              <button onClick={() => setOpenAnnouncement(null)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">{openAnnouncement.date}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{openAnnouncement.body}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
