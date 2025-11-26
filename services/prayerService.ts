import { PrayerData } from '../types';

const BASE_URL = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (lat: number, lng: number): Promise<PrayerData | null> => {
  try {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    // Method 2 is ISNA (Islamic Society of North America), widely used in West. 
    // You could make this configurable.
    const method = 2; 

    const response = await fetch(
      `${BASE_URL}/timings/${formattedDate}?latitude=${lat}&longitude=${lng}&method=${method}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

export const getCityPrayerTimes = async (city: string, country: string): Promise<PrayerData | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/timingsByCity?city=${city}&country=${country}&method=2`
        );
        if (!response.ok) return null;
        const json = await response.json();
        return json.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const calculateQiblaDirection = (lat: number, lng: number): number => {
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let qibla = toDeg(Math.atan2(y, x));
  return (qibla + 360) % 360;
};