import React, { useEffect, useState } from 'react';
import { getPrayerTimes, getCityPrayerTimes } from '../services/prayerService';
import { PrayerData } from '../types';

const PrayerWidget: React.FC = () => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState("Loading location...");

  useEffect(() => {
    const fetchTimes = async () => {
      // Try Geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            const data = await getPrayerTimes(latitude, longitude);
            if (data) {
                setPrayerData(data);
                // Reverse geocoding could be done here with Google Maps if enabled, 
                // but for now we settle for generic "Current Location" or lat/long
                setLocationName("Current Location");
            } else {
                setError("Could not fetch times.");
            }
            setLoading(false);
          },
          async (err) => {
            console.warn("Geolocation denied/failed, falling back to London", err);
            // Fallback to London
            setLocationName("London, UK");
            const data = await getCityPrayerTimes("London", "UK");
            setPrayerData(data);
            setLoading(false);
          }
        );
      } else {
        // Fallback if no geo support
        setLocationName("London, UK");
        const data = await getCityPrayerTimes("London", "UK");
        setPrayerData(data);
        setLoading(false);
      }
    };

    fetchTimes();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !prayerData) {
    return <div className="text-red-500 text-center p-4">Unable to load prayer times.</div>;
  }

  const prayers = [
    { name: 'Fajr', time: prayerData.timings.Fajr, icon: 'fa-cloud-sun' },
    { name: 'Dhuhr', time: prayerData.timings.Dhuhr, icon: 'fa-sun' },
    { name: 'Asr', time: prayerData.timings.Asr, icon: 'fa-cloud-sun-rain' },
    { name: 'Maghrib', time: prayerData.timings.Maghrib, icon: 'fa-moon' },
    { name: 'Isha', time: prayerData.timings.Isha, icon: 'fa-star' },
  ];

  const currentDate = prayerData.date.readable;
  const hijriDate = `${prayerData.date.hijri.date} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-emerald-50 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-gold-400"></div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Prayer Times</h2>
            <p className="text-emerald-600 text-sm font-medium"><i className="fas fa-map-marker-alt mr-1"></i> {locationName}</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-900 font-semibold">{currentDate}</p>
            <p className="text-gray-500 text-sm">{hijriDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {prayers.map((prayer) => (
            <div key={prayer.name} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100 group cursor-default">
              <div className="text-emerald-300 group-hover:text-emerald-500 mb-2 transition-colors">
                <i className={`fas ${prayer.icon} text-xl`}></i>
              </div>
              <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{prayer.name}</span>
              <span className="text-gray-900 font-bold text-lg">{prayer.time.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrayerWidget;
