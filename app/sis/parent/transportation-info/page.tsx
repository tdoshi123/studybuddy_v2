"use client";

import { Bus, MapPin, Clock, AlertCircle } from "lucide-react";

interface BusStop {
  name: string;
  time: string;
  isNext: boolean;
}

interface BusInfo {
  busNumber: string;
  routeName: string;
  status: "on-time" | "delayed";
  statusLabel: string;
  driver: string;
  capacity: string;
  yourStop: string;
  eta: string;
  stops: BusStop[];
  alert?: { title: string; body: string };
}

const ALEX_BUS: BusInfo = {
  busNumber: "#14",
  routeName: "Afternoon Route — Westfield Elementary",
  status: "on-time",
  statusLabel: "On Time",
  driver: "Mr. Ray Thompson",
  capacity: "48 students",
  yourStop: "Pine Ridge Subdivision",
  eta: "3:28 PM",
  stops: [
    { name: "Westfield Elementary School", time: "3:15 PM", isNext: false },
    { name: "Maple Ave & 3rd St", time: "3:20 PM", isNext: false },
    { name: "Oak Dr & Elm Ct", time: "3:25 PM", isNext: true },
    { name: "Pine Ridge Subdivision", time: "3:28 PM", isNext: false },
    { name: "Cedar Ln & Willow Way", time: "3:32 PM", isNext: false },
    { name: "Birch Park Apartments", time: "3:36 PM", isNext: false },
  ],
  alert: {
    title: "Weather Advisory",
    body: "Due to light rain, buses may be running 5–10 minutes behind schedule this afternoon.",
  },
};



export default function TransportationInfoPage() {
  const bus = ALEX_BUS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-950/40">
          <Bus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bus Tracking</h1>
      </div>

      {/* Alert */}
      {bus.alert && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{bus.alert.title}</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{bus.alert.body}</p>
          </div>
        </div>
      )}

      {/* Bus Status Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#6E8CB9]/10 flex items-center justify-center">
            <Bus className="w-7 h-7 text-[#6E8CB9]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bus {bus.busNumber}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bus.routeName}</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              bus.status === "on-time"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${bus.status === "on-time" ? "bg-green-500" : "bg-amber-500"}`} />
              {bus.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-80 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Live map tracking coming soon</p>
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
            {bus.stops.map((stop, index) => (
              <div key={index} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stop.isNext ? "bg-[#6E8CB9]" : "bg-gray-300 dark:bg-gray-600"}`} />
                <div className="flex-1">
                  <p className={`text-sm ${stop.isNext ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
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
              <span className="text-sm font-medium text-gray-900 dark:text-white">{bus.driver}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Bus Number</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{bus.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Capacity</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{bus.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Your Stop</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{bus.yourStop}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Arrival</span>
              <span className="text-sm font-medium text-[#6E8CB9]">{bus.eta}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
