
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Sunset: string;
  [key: string]: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: {
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Social' | 'Religious' | 'Education' | 'Charity';
  imageUrl: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface DonationItem {
  id: string;
  name: string;
  amount: number;
  goal: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female';
  dob?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  joinedDate: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
}

export interface Leader {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

export interface SiteConfig {
  hero: {
    title: string;
    quote: string;
    reference: string;
  };
  about: {
    description: string;
    vision: string;
    mission: string[];
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
  };
}
