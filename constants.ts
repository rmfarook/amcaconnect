import { Article, Event } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Community Iftar Gathering",
    date: "2024-03-15",
    time: "6:00 PM",
    location: "Main Hall, Ummah Center",
    description: "Join us for a community potluck Iftar. Bring a dish to share and enjoy the blessings of Ramadan together.",
    category: "Social",
    imageUrl: "https://picsum.photos/id/433/600/400"
  },
  {
    id: 2,
    title: "Understanding Surah Al-Kahf",
    date: "2024-03-18",
    time: "7:30 PM",
    location: "Library Conference Room",
    description: "A deep dive into the meanings and lessons of Surah Al-Kahf with Sheikh Abdullah.",
    category: "Education",
    imageUrl: "https://picsum.photos/id/1016/600/400"
  },
  {
    id: 3,
    title: "Youth Soccer Tournament",
    date: "2024-03-22",
    time: "10:00 AM",
    location: "City Sports Complex",
    description: "Annual youth soccer cup. Register your teams by Friday!",
    category: "Social",
    imageUrl: "https://picsum.photos/id/1058/600/400"
  },
  {
    id: 4,
    title: "Zakat & Charity Workshop",
    date: "2024-03-25",
    time: "2:00 PM",
    location: "Online (Zoom)",
    description: "Learn how to calculate your Zakat correctly and the impact of your charity.",
    category: "Charity",
    imageUrl: "https://picsum.photos/id/1060/600/400"
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "The Importance of Community in Islam",
    excerpt: "Why staying connected with the Ummah is vital for spiritual health.",
    content: "Islam places a heavy emphasis on community (Ummah). The Prophet Muhammad (peace be upon him) described the believers as one body; if one part aches, the whole body responds with sleeplessness and fever...",
    author: "Dr. Ahmed Zaid",
    date: "March 10, 2024",
    imageUrl: "https://picsum.photos/id/225/800/400",
    tags: ["Community", "Spirituality"]
  },
  {
    id: 2,
    title: "Preparation for Ramadan",
    excerpt: "5 practical tips to get your heart and home ready for the holy month.",
    content: "As the crescent moon approaches, believers around the world prepare their hearts. Here are practical steps: 1. Fast voluntary days in Shaban. 2. Increase Quran recitation...",
    author: "Sarah Yasin",
    date: "March 05, 2024",
    imageUrl: "https://picsum.photos/id/366/800/400",
    tags: ["Ramadan", "Tips"]
  },
  {
    id: 3,
    title: "Islamic History: The Golden Age",
    excerpt: "Exploring the contributions of Muslim scholars to science and math.",
    content: "From Algebra to Astronomy, the Golden Age of Islam was a beacon of light during the dark ages of Europe...",
    author: "Historian Bilal",
    date: "February 28, 2024",
    imageUrl: "https://picsum.photos/id/214/800/400",
    tags: ["History", "Science"]
  }
];

export const DONATION_DATA = [
  { name: 'Mosque Renovation', amount: 4000, goal: 10000 },
  { name: 'Food Drive', amount: 2500, goal: 3000 },
  { name: 'Education Fund', amount: 1500, goal: 5000 },
  { name: 'Eid Festival', amount: 3200, goal: 4000 },
];
