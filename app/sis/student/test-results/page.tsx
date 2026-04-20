"use client";

import { ClipboardCheck } from "lucide-react";

interface TestScore {
  id: string;
  testName: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  percentile: number;
  level: "Advanced" | "Proficient" | "Basic" | "Below Basic";
  previousScore: number | null;
}

const ALEX_SCORES: TestScore[] = [
  { id: "a1", testName: "MAP Growth", subject: "Mathematics", date: "Jan 2026", score: 218, maxScore: 260, percentile: 72, level: "Proficient", previousScore: 210 },
  { id: "a2", testName: "MAP Growth", subject: "Reading", date: "Jan 2026", score: 211, maxScore: 260, percentile: 65, level: "Proficient", previousScore: 208 },
  { id: "a3", testName: "MAP Growth", subject: "Language Usage", date: "Jan 2026", score: 214, maxScore: 260, percentile: 68, level: "Proficient", previousScore: 214 },
  { id: "a4", testName: "STAR Reading", subject: "Reading", date: "Dec 2025", score: 534, maxScore: 800, percentile: 58, level: "Basic", previousScore: 502 },
  { id: "a5", testName: "STAR Math", subject: "Mathematics", date: "Dec 2025", score: 612, maxScore: 900, percentile: 71, level: "Proficient", previousScore: 585 },
  { id: "a6", testName: "District Benchmark", subject: "Science", date: "Nov 2025", score: 78, maxScore: 100, percentile: 64, level: "Basic", previousScore: 72 },
  { id: "a7", testName: "District Benchmark", subject: "ELA", date: "Nov 2025", score: 82, maxScore: 100, percentile: 70, level: "Proficient", previousScore: 79 },
  { id: "a8", testName: "District Benchmark", subject: "Mathematics", date: "Nov 2025", score: 85, maxScore: 100, percentile: 74, level: "Proficient", previousScore: 80 },
];

const EMMA_SCORES: TestScore[] = [
  { id: "e1", testName: "MAP Growth", subject: "Mathematics", date: "Jan 2026", score: 198, maxScore: 240, percentile: 88, level: "Advanced", previousScore: 188 },
  { id: "e2", testName: "MAP Growth", subject: "Reading", date: "Jan 2026", score: 201, maxScore: 240, percentile: 91, level: "Advanced", previousScore: 195 },
  { id: "e3", testName: "MAP Growth", subject: "Language Usage", date: "Jan 2026", score: 196, maxScore: 240, percentile: 85, level: "Proficient", previousScore: 192 },
  { id: "e4", testName: "STAR Reading", subject: "Reading", date: "Dec 2025", score: 489, maxScore: 700, percentile: 82, level: "Proficient", previousScore: 461 },
  { id: "e5", testName: "STAR Math", subject: "Mathematics", date: "Dec 2025", score: 530, maxScore: 700, percentile: 86, level: "Advanced", previousScore: 508 },
  { id: "e6", testName: "District Benchmark", subject: "Science", date: "Nov 2025", score: 91, maxScore: 100, percentile: 88, level: "Advanced", previousScore: 87 },
  { id: "e7", testName: "District Benchmark", subject: "ELA", date: "Nov 2025", score: 94, maxScore: 100, percentile: 92, level: "Advanced", previousScore: 90 },
  { id: "e8", testName: "District Benchmark", subject: "Mathematics", date: "Nov 2025", score: 93, maxScore: 100, percentile: 90, level: "Advanced", previousScore: 88 },
];

const SCORE_DATA: Record<string, TestScore[]> = {
  "1": ALEX_SCORES,
  "2": EMMA_SCORES,
};

function levelColor(level: TestScore["level"]): string {
  switch (level) {
    case "Advanced": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Proficient": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Basic": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Below Basic": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
}


export default function TestResultsPage() {
  const scores = SCORE_DATA["1"] ?? [];

  const testGroups = scores.reduce<Record<string, TestScore[]>>((acc, s) => {
    (acc[s.testName] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-50 dark:bg-purple-950/40">
          <ClipboardCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Test Results</h1>
      </div>

      {/* Test result tables grouped by test name */}
      {Object.entries(testGroups).map(([testName, testScores]) => (
        <section key={testName}>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">{testName}</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subject</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Percentile</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {testScores.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{t.subject}</td>
                      <td className="text-center px-3 py-3 text-sm text-gray-500 dark:text-gray-400">{t.date}</td>
                      <td className="text-center px-3 py-3">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{t.score}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">/{t.maxScore}</span>
                      </td>
                      <td className="text-center px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#1e3a8a]"
                              style={{ width: `${t.percentile}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.percentile}%</span>
                        </div>
                      </td>
                      <td className="text-center px-3 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${levelColor(t.level)}`}>
                          {t.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      {/* Performance level legend */}
      <section>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Performance Levels</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
            {[
              { level: "Advanced", desc: "Exceeds grade-level expectations" },
              { level: "Proficient", desc: "Meets grade-level expectations" },
              { level: "Basic", desc: "Approaching grade-level expectations" },
              { level: "Below Basic", desc: "Below grade-level expectations" },
            ].map(({ level, desc }) => (
              <div key={level} className="flex items-center gap-1.5">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${levelColor(level as TestScore["level"])}`}>{level}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
