
import { Event, Article, DonationItem, Leader, SiteConfig } from '../types';
import { MOCK_EVENTS, MOCK_ARTICLES, DONATION_DATA } from '../constants';

const STORAGE_KEYS = {
  EVENTS: 'ummah_events',
  ARTICLES: 'ummah_articles',
  DONATIONS: 'ummah_donations',
  LEADERS: 'ummah_leaders',
  CONFIG: 'ummah_site_config'
};

// Default Configuration
const DEFAULT_CONFIG: SiteConfig = {
  hero: {
    title: 'Daily Inspiration',
    quote: '"Indeed, with hardship [will be] ease."',
    reference: 'Quran 94:6 - A reminder that every challenge carries within it the seeds of relief and success.'
  },
  about: {
    description: 'AmcaConnect serves a diverse and vibrant Muslim community. Established in 2024, our goal is to foster brotherhood/sisterhood, provide educational resources, and serve the wider society with compassion and excellence.',
    vision: 'To be a beacon of Islamic excellence and spiritual sanctuary that nurtures a righteous, educated, and united community contributing positively to society.',
    mission: [
      'Establish regular prayer and spiritual programs.',
      'Provide authentic Islamic education for all ages.',
      'Support the needy through Zakat and Sadaqah.'
    ]
  },
  contact: {
    address: 'AMCA Masjid, Ashok Nagar, 4th Avenue, Chennai - 83',
    phone: '9876543210',
    email: 'reachus_amca@gmail.com',
    mapUrl: 'https://maps.google.com/maps?q=13.039697878828262,80.2146701784837&z=15&output=embed'
  }
};

const DEFAULT_LEADERS: Leader[] = [
  { id: 1, name: 'Brother Ahmed', role: 'President', description: 'Leading with vision and dedication.', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Brother Yusuf', role: 'Secretary', description: 'Managing community affairs.', imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 3, name: 'Brother Bilal', role: 'Treasurer', description: 'Ensuring financial transparency.', imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

// Helper to generate IDs
const generateId = () => Math.floor(Math.random() * 100000);

export const dataService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(MOCK_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(MOCK_ARTICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      const donationsWithIds = DONATION_DATA.map((d: any, idx: number) => ({
        ...d,
        id: d.id || `don-${idx}`
      }));
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donationsWithIds));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERS)) {
      localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(DEFAULT_LEADERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }
  },

  // Events
  getEvents: (): Event[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },
  saveEvent: (event: Event) => {
    const events = dataService.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.push({ ...event, id: event.id || generateId() });
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },
  deleteEvent: (id: number) => {
    const events = dataService.getEvents().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Articles
  getArticles: (): Article[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  },
  saveArticle: (article: Article) => {
    const articles = dataService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index >= 0) {
      articles[index] = article;
    } else {
      articles.push({ ...article, id: article.id || generateId() });
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },
  deleteArticle: (id: number) => {
    const articles = dataService.getArticles().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },

  // Donations
  getDonations: (): DonationItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveDonation: (donation: DonationItem) => {
    const items = dataService.getDonations();
    const index = items.findIndex(d => d.id === donation.id);
    if (index >= 0) {
      items[index] = donation;
    } else {
      items.push({ ...donation, id: donation.id || `don-${Date.now()}` });
    }
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(items));
  },
  deleteDonation: (id: string) => {
      const items = dataService.getDonations().filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(items));
  },

  // Leaders
  getLeaders: (): Leader[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERS);
    return data ? JSON.parse(data) : [];
  },
  saveLeader: (leader: Leader) => {
    const list = dataService.getLeaders();
    const index = list.findIndex(l => l.id === leader.id);
    if (index >= 0) {
      list[index] = leader;
    } else {
      list.push({ ...leader, id: leader.id || generateId() });
    }
    localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(list));
  },
  deleteLeader: (id: number) => {
    const list = dataService.getLeaders().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(list));
  },

  // Site Config
  getSiteConfig: (): SiteConfig => {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : DEFAULT_CONFIG;
  },
  saveSiteConfig: (config: SiteConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }
};
