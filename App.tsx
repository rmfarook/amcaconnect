
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PrayerWidget from './components/PrayerWidget';
import AssistantChat from './components/AssistantChat';
import QiblaFinder from './components/QiblaFinder';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { getCityPrayerTimes, getPrayerTimes } from './services/prayerService';
import { Event, Article, DonationItem, User, PrayerData, Leader, SiteConfig } from './types';

// --- NEW PAGES ---

const DetailedPrayerPage = () => {
    const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimes = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const data = await getPrayerTimes(position.coords.latitude, position.coords.longitude);
                        setPrayerData(data);
                        setLoading(false);
                    },
                    async () => {
                        const data = await getCityPrayerTimes("London", "UK");
                        setPrayerData(data);
                        setLoading(false);
                    }
                );
            } else {
                const data = await getCityPrayerTimes("London", "UK");
                setPrayerData(data);
                setLoading(false);
            }
        };
        fetchTimes();
    }, []);

    if (loading) return <div className="text-center py-20">Loading Prayer Times...</div>;
    if (!prayerData) return <div className="text-center py-20 text-red-500">Unable to fetch prayer times.</div>;

    const t = prayerData.timings;

    // Helper to add minutes to time string (HH:MM)
    const addMinutes = (timeStr: string, minutes: number) => {
        if (!timeStr) return "--:--";
        const [time, period] = timeStr.split(' '); // Aladhan might return "05:00 (BST)" or just "05:00"
        const cleanTime = time.split(' ')[0]; 
        const [h, m] = cleanTime.split(':').map(Number);
        const date = new Date();
        date.setHours(h);
        date.setMinutes(m + minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-gray-800">Prayer Timings</h2>
                <p className="text-emerald-600">{prayerData.date.readable} • {prayerData.date.hijri.date} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Daily Prayers (Fard) */}
                <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
                    <div className="bg-emerald-600 text-white p-4 text-center font-bold font-serif">
                        Daily Prayers (Fard)
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { name: 'Fajr', time: t.Fajr },
                            { name: 'Dhuhr', time: t.Dhuhr },
                            { name: 'Asr', time: t.Asr },
                            { name: 'Maghrib', time: t.Maghrib },
                            { name: 'Isha', time: t.Isha },
                            { name: 'Jumu\'ah', time: '1:15 PM' } // Hardcoded for example
                        ].map(p => (
                            <div key={p.name} className="flex justify-between p-4 hover:bg-gray-50">
                                <span className="font-semibold text-gray-700">{p.name}</span>
                                <span className="font-mono font-bold text-emerald-700">{p.time.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sun & Nafil Times */}
                <div className="bg-white rounded-xl shadow-sm border border-gold-100 overflow-hidden">
                    <div className="bg-gold-500 text-white p-4 text-center font-bold font-serif">
                        Sun & Nafil Prayers
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { name: 'Sahar (Imsak)', time: t.Imsak, desc: 'End of Suhoor' },
                            { name: 'Sunrise', time: t.Sunrise, desc: 'No Prayer' },
                            { name: 'Ishraq', time: addMinutes(t.Sunrise, 15), desc: '15 mins after Sunrise' },
                            { name: 'Chasht (Duha)', time: addMinutes(t.Sunrise, 25) + ' - ' + addMinutes(t.Dhuhr, -15), desc: 'Forenoon' },
                            { name: 'Sunset (Iftar)', time: t.Maghrib, desc: 'Break Fast' }, // Maghrib is sunset
                            { name: 'Awwabin', time: addMinutes(t.Maghrib, 10), desc: 'After Maghrib' },
                            { name: 'Tahajjud', time: 'Last 1/3 Night', desc: 'Pre-Fajr' }
                        ].map(p => (
                            <div key={p.name} className="flex justify-between p-4 hover:bg-gray-50">
                                <div>
                                    <span className="font-semibold text-gray-700 block">{p.name}</span>
                                    <span className="text-xs text-gray-400">{p.desc}</span>
                                </div>
                                <span className="font-mono font-bold text-gray-600">{p.time.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeadershipPage = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    
    useEffect(() => {
        setLeaders(dataService.getLeaders());
    }, []);

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">Community Leadership</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {leaders.map(leader => (
                    <div key={leader.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden border-2 border-emerald-50">
                            <img 
                                src={leader.imageUrl || `https://randomuser.me/api/portraits/men/${leader.id + 30}.jpg`} 
                                alt={leader.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{leader.name}</h3>
                        <p className="text-emerald-600 text-sm mb-2">{leader.role}</p>
                        <p className="text-gray-500 text-sm">{leader.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MaktabPage = () => (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="bg-emerald-50 rounded-2xl p-8 mb-8 flex items-center justify-between">
            <div>
                 <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Maktab Madaras</h2>
                 <p className="text-emerald-700">Islamic Education for Children (Ages 5-15)</p>
            </div>
            <i className="fas fa-child text-5xl text-emerald-200"></i>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl mb-4">Curriculum</h3>
                <ul className="space-y-2 text-gray-600">
                    <li><i className="fas fa-check text-emerald-500 mr-2"></i> Quran Reading & Memorization (Hifz basics)</li>
                    <li><i className="fas fa-check text-emerald-500 mr-2"></i> Islamic Beliefs (Aqeedah)</li>
                    <li><i className="fas fa-check text-emerald-500 mr-2"></i> Prophetic Stories (Seerah)</li>
                    <li><i className="fas fa-check text-emerald-500 mr-2"></i> Daily Duas & Etiquette (Akhlaq)</li>
                </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl mb-4">Class Schedule</h3>
                <p className="mb-2"><strong>Weekdays:</strong> Mon - Thu | 5:00 PM - 7:00 PM</p>
                <p className="mb-4"><strong>Weekend:</strong> Sat - Sun | 10:00 AM - 1:00 PM</p>
                <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700">Register Child</button>
            </div>
        </div>
    </div>
);

const QuranClassPage = () => (
    <div className="animate-fade-in max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Adult Quran Classes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">It is never too late to learn the book of Allah. Join our evening circles for Tajweed correction and Tafsir study.</p>
        <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-emerald-700 mb-2">Brothers' Halaqa</h3>
                <p>Every Tuesday after Maghrib.</p>
                <p className="text-sm text-gray-500 mt-2">Instructor: Sheikh Abdullah</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-emerald-700 mb-2">Sisters' Tajweed</h3>
                <p>Every Wednesday 10:00 AM (Online available).</p>
                <p className="text-sm text-gray-500 mt-2">Instructor: Sister Fatima</p>
            </div>
        </div>
    </div>
);

const GenericProgramPage = ({ title, subtitle, items, onContactClick }: any) => (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{subtitle}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 text-xl">
                        <i className={`fas ${item.icon}`}></i>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
            ))}
            
            {/* Contact Us Box */}
            <div 
                onClick={onContactClick}
                className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-100 transition-colors group"
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 mb-4 text-xl group-hover:scale-110 transition-transform shadow-sm">
                    <i className="fas fa-envelope-open-text"></i>
                </div>
                <h3 className="font-bold text-lg mb-2 text-emerald-900">Contact Us</h3>
                <p className="text-sm text-emerald-700">Need more info? Get in touch with our team.</p>
            </div>
        </div>
    </div>
);

const ContactPage = () => {
    const [config, setConfig] = useState<SiteConfig | null>(null);

    useEffect(() => {
        setConfig(dataService.getSiteConfig());
    }, []);

    if (!config) return <div>Loading...</div>;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h3 className="font-bold text-lg mb-6 text-emerald-700 border-b border-gray-100 pb-2">Get in Touch</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-800">Visit Us</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                    {config.contact.address}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                                <i className="fas fa-phone"></i>
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-800">Call Us</h4>
                                <p className="text-gray-600 text-sm mt-1">{config.contact.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-800">Email Us</h4>
                                <p className="text-gray-600 text-sm mt-1">{config.contact.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-96 md:h-auto">
                    <iframe 
                        title="Location Map"
                        src={config.contact.mapUrl}
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

const DonatePage = () => (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Support Your Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                "Those who spend their wealth in the way of Allah is similar to a grain which grows seven ears, and in every ear is a hundred grains." (Quran 2:261)
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500 text-center hover:-translate-y-1 transition-transform">
                <i className="fas fa-hand-holding-heart text-4xl text-emerald-500 mb-4"></i>
                <h3 className="font-bold text-xl mb-2">Zakat</h3>
                <p className="text-sm text-gray-500 mb-6">Obligatory charity distributed to the eligible.</p>
                <button className="w-full border border-emerald-600 text-emerald-600 py-2 rounded-lg font-bold">Calculate & Pay</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-gold-500 text-center hover:-translate-y-1 transition-transform">
                <i className="fas fa-coins text-4xl text-gold-500 mb-4"></i>
                <h3 className="font-bold text-xl mb-2">Sadaqah</h3>
                <p className="text-sm text-gray-500 mb-6">Voluntary charity for mosque maintenance.</p>
                <button className="w-full bg-gold-500 text-white py-2 rounded-lg font-bold">Donate Now</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 text-center hover:-translate-y-1 transition-transform">
                <i className="fas fa-graduation-cap text-4xl text-blue-500 mb-4"></i>
                <h3 className="font-bold text-xl mb-2">Education Fund</h3>
                <p className="text-sm text-gray-500 mb-6">Support Islamic school and youth programs.</p>
                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-bold">Support Education</button>
            </div>
        </div>
    </div>
);

const MediaPage = ({ type }: { type: 'photo' | 'video' | 'mixed' | 'announcements' }) => (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">
            {type === 'announcements' ? 'Community Announcements' : 'Media Gallery'}
        </h2>
        
        {type === 'announcements' ? (
            <div className="space-y-4">
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                     <p className="font-bold text-yellow-800">Eid-ul-Adha Prayer Timings</p>
                     <p className="text-sm text-yellow-700">1st Jamaat: 7:00 AM, 2nd Jamaat: 8:30 AM. Please carpool.</p>
                 </div>
                 <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                     <p className="font-bold text-blue-800">Parking Notice</p>
                     <p className="text-sm text-blue-700">Please do not park in front of neighbors' driveways during Jumu'ah.</p>
                 </div>
            </div>
        ) : (
            <div>
                <h3 className="text-xl font-bold mb-4 text-gray-700">Recent Photos & Videos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer">
                            <img src={`https://picsum.photos/400?random=${i}`} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// --- EXISTING COMPONENTS (Home, About, Articles, Events) ---

const HeroSection = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  
  useEffect(() => {
    setConfig(dataService.getSiteConfig());
  }, []);

  if (!config) return null;

  return (
    <div className="relative bg-emerald-900 text-white rounded-2xl overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/60"></div>
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-8 md:mb-0">
            <span className="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider mb-4 border border-gold-500/30">
                {config.hero.title}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                {config.hero.quote}
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl">
                {config.hero.reference}
            </p>
            <button className="bg-gold-500 text-emerald-950 font-bold py-3 px-8 rounded-full hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
            Read Today's Reflection
            </button>
        </div>
        <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
            <i className="fas fa-quran text-6xl text-emerald-200"></i>
            </div>
        </div>
        </div>
    </div>
  );
};

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setEvents(dataService.getEvents().slice(0, 2));
    setArticles(dataService.getArticles().slice(0, 1));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <HeroSection />
      <PrayerWidget />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 font-serif">Upcoming Events</h3>
            <span className="text-emerald-600 text-sm font-medium cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
             {events.map(event => (
                <div key={event.id} className="flex space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-emerald-600 font-medium">{event.date} • {event.time}</p>
                    </div>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 font-serif">Latest Knowledge</h3>
             <span className="text-emerald-600 text-sm font-medium cursor-pointer">Read Blog</span>
          </div>
          {articles.length > 0 && (
            <div className="group cursor-pointer">
               <div className="h-40 w-full rounded-lg overflow-hidden mb-4 relative">
                  <img src={articles[0].imageUrl} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{articles[0].title}</h4>
               <p className="text-gray-600 text-sm line-clamp-2">{articles[0].excerpt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => { setArticles(dataService.getArticles()); }, []);
    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Islamic Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => { setEvents(dataService.getEvents()); }, []);
    return (
        <div className="animate-fade-in space-y-8">
             <div className="flex justify-between items-end">
                 <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Upcoming Events</h2>
                 <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                     <i className="fas fa-plus mr-2"></i> Submit Event
                 </button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {events.map(event => (
                     <div key={event.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-5">
                         <div className="md:w-48 h-32 md:h-auto rounded-lg overflow-hidden flex-shrink-0 relative">
                             <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                             <div className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                 {event.category}
                             </div>
                         </div>
                         <div className="flex-1">
                                 <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                 <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                                     <span><i className="fas fa-calendar-alt text-emerald-500 mr-1"></i> {event.date}</span>
                                     <span><i className="fas fa-clock text-emerald-500 mr-1"></i> {event.time}</span>
                                 </div>
                                 <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const AboutCommunityPage = () => {
    const [config, setConfig] = useState<SiteConfig | null>(null);

    useEffect(() => {
        setConfig(dataService.getSiteConfig());
    }, []);

    if (!config) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    <i className="fas fa-users"></i>
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">About the Community</h2>
                <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                    {config.about.description}
                </p>
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-800 text-white p-8 rounded-xl shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <i className="fas fa-eye text-9xl"></i>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-bold mb-4 text-gold-400">Our Vision</h3>
                        <p className="leading-relaxed text-emerald-50 whitespace-pre-wrap">
                            {config.about.vision}
                        </p>
                    </div>
                </div>

                <div className="bg-white border-t-4 border-gold-500 p-8 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <i className="fas fa-bullseye text-9xl text-gray-800"></i>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-bold mb-4 text-gray-800">Our Mission</h3>
                        <ul className="space-y-3 text-gray-600">
                            {config.about.mission.map((item, idx) => (
                                <li key={idx} className="flex items-start">
                                    <i className="fas fa-check-circle text-emerald-500 mt-1 mr-3"></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dataService.init();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentPage('home');
  };

  const handleAdminSuccess = () => {
      setIsAdmin(true);
      setCurrentPage('admin');
  };

  // Helper to go to contact
  const goToContact = () => setCurrentPage('contact');

  const renderPage = () => {
    if (currentPage === 'home') return <Home />;
    
    // About
    if (currentPage === 'about-community') return <AboutCommunityPage />;
    if (currentPage === 'leadership') return <LeadershipPage />;
    
    // Prayer
    if (currentPage === 'prayer-times') return <DetailedPrayerPage />;
    if (currentPage === 'qibla') return <QiblaFinder />;
    
    // Knowledge
    if (currentPage === 'maktab') return <MaktabPage />;
    if (currentPage === 'quran-class') return <QuranClassPage />;
    if (currentPage === 'articles') return <ArticlesPage />;
    
    // Events
    if (currentPage === 'events-upcoming') return <EventsPage />;
    if (currentPage === 'youth') return <GenericProgramPage title="Youth Program" subtitle="Empowering the next generation." items={[{title:'Youth Halaqa', icon:'fa-user-friends', desc:'Weekly discussions.'}, {title:'Sports Night', icon:'fa-basketball-ball', desc:'Monthly activities.'}]} onContactClick={goToContact} />;
    if (currentPage === 'sisters') return <GenericProgramPage title="Sisters' Program" subtitle="A space for spiritual growth and connection." items={[{title:'Sisters Coffee Morning', icon:'fa-coffee', desc:'Monthly social.'}, {title:'Fiqh of Women', icon:'fa-book', desc:'Weekly class.'}]} onContactClick={goToContact} />;
    
    // Services
    if (currentPage === 'nikah') return <GenericProgramPage title="Nikah Hall" subtitle="Complete matrimonial services." items={[{title:'Hall Booking', icon:'fa-building', desc:'Capacity for 200 guests.'}, {title:'Imam Services', icon:'fa-pen-fancy', desc:'Officiating Nikah.'}]} onContactClick={goToContact} />;
    if (currentPage === 'counseling') return <GenericProgramPage title="Counseling & Support" subtitle="Confidential support for individuals and families." items={[{title:'Marital Counseling', icon:'fa-heart-broken', desc:'Reconciling hearts.'}, {title:'Youth Counseling', icon:'fa-user-shield', desc:'Navigating challenges.'}]} onContactClick={goToContact} />;
    if (currentPage === 'education-assist') return <GenericProgramPage title="Education Support" subtitle="Helping students achieve their potential." items={[{title:'Scholarships', icon:'fa-graduation-cap', desc:'Financial aid.'}, {title:'Tutoring', icon:'fa-chalkboard-teacher', desc:'After-school help.'}]} onContactClick={goToContact} />;
    if (currentPage === 'career') return <GenericProgramPage title="Career Guidance" subtitle="Professional networking and mentorship." items={[{title:'Resume Review', icon:'fa-file-alt', desc:'Expert feedback.'}, {title:'Mentorship', icon:'fa-handshake', desc:'Connect with professionals.'}]} onContactClick={goToContact} />;
    if (currentPage === 'charity') return <GenericProgramPage title="Charity Drives" subtitle="Serving humanity." items={[
        {title:'Zakat', icon:'fa-hand-holding-heart', desc:'Obligatory charity distributed to the eligible.'}, 
        {title:'Sadaqah', icon:'fa-coins', desc:'Voluntary charity for mosque maintenance.'}
    ]} onContactClick={goToContact} />;

    // Media
    if (currentPage === 'media-gallery') return <MediaPage type="mixed" />;
    if (currentPage === 'announcements') return <MediaPage type="announcements" />;

    // General
    if (currentPage === 'contact') return <ContactPage />;
    
    if (currentPage === 'admin') return <AdminDashboard isAuthenticated={isAdmin} onAuthenticated={handleAdminSuccess} onLogout={() => { setIsAdmin(false); setCurrentPage('home'); }} />;
    if (currentPage === 'auth') return <AuthPage onLoginSuccess={handleLoginSuccess} onAdminLoginSuccess={handleAdminSuccess} />;

    return <Home />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-20 lg:pb-0">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            {renderPage()}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center text-sm text-gray-500 hidden lg:block">
            <p>&copy; 2024 AmcaConnect. All Rights Reserved.</p>
        </footer>

        <AssistantChat />
    </div>
  );
};

export default App;
