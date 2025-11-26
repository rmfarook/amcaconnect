import React, { useEffect, useState } from 'react';
import { calculateQiblaDirection } from '../services/prayerService';

const QiblaFinder: React.FC = () => {
  const [direction, setDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompassSupport, setHasCompassSupport] = useState(false);

  useEffect(() => {
    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const qibla = calculateQiblaDirection(latitude, longitude);
          setDirection(qibla);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Please enable location services to find the Qibla direction.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLoading(false);
    }

    // 2. Setup Device Orientation (Magnetometer)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = 0;
      
      // iOS specific property
      if ((e as any).webkitCompassHeading) {
        heading = (e as any).webkitCompassHeading;
      } 
      // Standard Android/Web
      else if (e.alpha !== null) {
        // alpha is 0 at North, usually increases counter-clockwise or clockwise depending on device
        // Simplified fallback for devices that support absolute orientation
        heading = 360 - e.alpha; 
      }
      
      setCompassHeading(heading);
      setHasCompassSupport(true);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestCompassPermission = async () => {
    // iOS 13+ requires manual permission request
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          // Re-trigger useEffect or simple alert for now
          alert("Compass permission granted. Please rotate your device.");
        } else {
          alert("Permission denied.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Calculate needle rotation
  // If we have compass support, we rotate the compass ROSE opposite to device heading (so North stays North)
  // And the Qibla needle stays fixed at the Qibla angle relative to North.
  // Alternatively, simpler visualization:
  // Rotate the NEEDLE to (Qibla - DeviceHeading).
  
  const needleRotation = direction !== null 
    ? (hasCompassSupport ? direction - compassHeading : direction) 
    : 0;

  const compassRotation = hasCompassSupport ? -compassHeading : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6">
        <i className="fas fa-map-marker-slash text-4xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Location Required</h3>
        <p className="text-gray-500">{locationError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-50 overflow-hidden relative p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Qibla Finder</h2>
          <p className="text-gray-500">
            {hasCompassSupport ? "Rotate your device to align" : "Static Compass Mode"}
          </p>
          {direction !== null && (
            <div className="mt-4 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full inline-block font-semibold shadow-sm">
              <i className="fas fa-kaaba mr-2"></i>
              {Math.round(direction)}° from North
            </div>
          )}
        </div>

        {/* Compass UI */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Compass Rose (Background) */}
          <div 
            className="absolute inset-0 border-4 border-gray-200 rounded-full flex items-center justify-center bg-white shadow-inner transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Cardinal Points */}
            <span className="absolute top-2 text-xs font-bold text-gray-400">N</span>
            <span className="absolute bottom-2 text-xs font-bold text-gray-400">S</span>
            <span className="absolute right-2 text-xs font-bold text-gray-400">E</span>
            <span className="absolute left-2 text-xs font-bold text-gray-400">W</span>
            
            {/* Degree ticks (simplified) */}
            <div className="w-full h-0.5 bg-gray-100 absolute top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="h-full w-0.5 bg-gray-100 absolute left-1/2 top-0 transform -translate-x-1/2"></div>
            
            {/* Qibla Indicator on the Dial */}
            {direction !== null && (
               <div 
                 className="absolute w-full h-full"
                 style={{ transform: `rotate(${direction}deg)` }}
               >
                 <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <i className="fas fa-kaaba text-gold-500 text-2xl drop-shadow-md"></i>
                 </div>
               </div>
            )}
          </div>

          {/* Center Pivot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-white"></div>
          
          {/* Needle (If no compass support, we just show the Qibla on the rose. If we want a needle pointing North, we can add it) */}
          {/* Visual enhancements for 'Needle' style */}
          <div 
             className="absolute top-0 left-1/2 h-1/2 w-1 origin-bottom transform -translate-x-1/2 z-0 opacity-20"
             style={{ transform: `rotate(${compassRotation}deg)` }}
          >
              <div className="w-full h-full bg-red-500 rounded-t-full"></div>
          </div>
        </div>

        <div className="text-center space-y-4">
           {!hasCompassSupport && (
               <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-700">
                   <p><i className="fas fa-info-circle mr-1"></i> Compass not detected.</p>
                   <p className="mt-1">Please use a standard compass and face <strong>{Math.round(direction || 0)}°</strong> clockwise from North.</p>
                   {/* iOS Permission Button */}
                    <button 
                        onClick={requestCompassPermission}
                        className="mt-3 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                    >
                        Enable Compass (iOS)
                    </button>
               </div>
           )}
           
           <div className="text-xs text-gray-400">
               Accuracy depends on your device's magnetometer and calibration.
           </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaFinder;