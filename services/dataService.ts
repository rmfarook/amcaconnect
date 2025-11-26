import { Event, Article, DonationItem } from '../types';
import { MOCK_EVENTS, MOCK_ARTICLES, DONATION_DATA } from '../constants';

const STORAGE_KEYS = {
  EVENTS: 'ummah_events',
  ARTICLES: 'ummah_articles',
  DONATIONS: 'ummah_donations'
};

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
      // Add IDs to initial donation data if missing
      const donationsWithIds = DONATION_DATA.map((d: any, idx: number) => ({
        ...d,
        id: d.id || `don-${idx}`
      }));
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donationsWithIds));
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
  }
};