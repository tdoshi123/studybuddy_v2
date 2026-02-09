import { Bus, MapPin, Clock, AlertCircle } from "lucide-react";

export default function BusTrackingPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-normal text-gray-900 dark:text-white">
          Bus Tracking
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Track your school bus in real-time
        </p>
      </div>

      {/* Bus Status Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#6E8CB9]/10 flex items-center justify-center">
            <Bus className="w-7 h-7 text-[#6E8CB9]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bus #42
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Morning Route - Westside Elementary
            </p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              On Time
            </span>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-80 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Live map tracking coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Stops */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Stops</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {MOCK_STOPS.map((stop, index) => (
              <div key={index} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stop.isNext ? 'bg-[#6E8CB9]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${stop.isNext ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {stop.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{stop.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bus Details */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Bus Details</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Driver</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Mr. Robert Smith</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Bus Number</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">#42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Capacity</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">48 students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Your Stop</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Oak Street & 5th Ave</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Arrival</span>
              <span className="text-sm font-medium text-[#6E8CB9]">7:35 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Weather Advisory
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Due to light rain, buses may be running 5-10 minutes behind schedule this morning.
          </p>
        </div>
      </div>
    </div>
  );
}

const MOCK_STOPS = [
  { name: "Maple Street & Main", time: "7:15 AM", isNext: false },
  { name: "Pine Avenue & 2nd St", time: "7:22 AM", isNext: false },
  { name: "Oak Street & 5th Ave", time: "7:35 AM", isNext: true },
  { name: "Elm Road & Park Blvd", time: "7:42 AM", isNext: false },
  { name: "Westside Elementary School", time: "7:55 AM", isNext: false },
];

