import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PrayerWidget from './components/PrayerWidget';
import AssistantChat from './components/AssistantChat';
import QiblaFinder from './components/QiblaFinder';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { Event, Article, DonationItem, User } from './types';

const HeroSection = () => (
  <div className="relative bg-emerald-900 text-white rounded-2xl overflow-hidden mb-8 shadow-xl">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/60"></div>
    <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center">
      <div className="md:w-2/3 mb-8 md:mb-0">
        <span className="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider mb-4 border border-gold-500/30">DAILY INSPIRATION</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
          "Indeed, with hardship [will be] ease."
        </h2>
        <p className="text-emerald-100 text-lg mb-8 max-w-xl">
          Quran 94:6 - A reminder that every challenge carries within it the seeds of relief and success.
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
        {/* Featured Event */}
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
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                    </div>
                </div>
             ))}
             {events.length === 0 && <p className="text-gray-500 text-sm italic">No upcoming events scheduled.</p>}
          </div>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 font-serif">Latest Knowledge</h3>
             <span className="text-emerald-600 text-sm font-medium cursor-pointer">Read Blog</span>
          </div>
          {articles.length > 0 ? (
            <div className="group cursor-pointer">
               <div className="h-40 w-full rounded-lg overflow-hidden mb-4 relative">
                  <img src={articles[0].imageUrl} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">
                      {articles[0].tags[0]}
                  </div>
               </div>
               <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{articles[0].title}</h4>
               <p className="text-gray-600 text-sm line-clamp-2">{articles[0].excerpt}</p>
            </div>
          ) : (
             <p className="text-gray-500 text-sm italic">No articles available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    
    useEffect(() => {
        setArticles(dataService.getArticles());
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Islamic Resources</h2>
            <p className="text-gray-600 mb-8">Explore articles, lectures, and reflections from our scholars.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex space-x-2 mb-3">
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{tag}</span>
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4 border-gray-100">
                                <span><i className="fas fa-user mr-1"></i> {article.author}</span>
                                <span>{article.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {articles.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500">No articles found. Check back later!</p>
                </div>
            )}
        </div>
    );
};

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [donations, setDonations] = useState<DonationItem[]>([]);

    useEffect(() => {
        setEvents(dataService.getEvents());
        setDonations(dataService.getDonations());
    }, []);

    return (
        <div className="animate-fade-in space-y-8">
             <div className="flex justify-between items-end">
                 <div>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Community & Events</h2>
                    <p className="text-gray-600">Join our upcoming gatherings and support community initiatives.</p>
                 </div>
                 <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                     <i className="fas fa-plus mr-2"></i> Submit Event
                 </button>
             </div>
    
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Left Column: Events List */}
                 <div className="lg:col-span-2 space-y-4">
                     {events.map(event => (
                         <div key={event.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-5">
                             <div className="md:w-48 h-32 md:h-auto rounded-lg overflow-hidden flex-shrink-0 relative">
                                 <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                 <div className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                     {event.category}
                                 </div>
                             </div>
                             <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                     <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                     <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                                         <span><i className="fas fa-calendar-alt text-emerald-500 mr-1"></i> {event.date}</span>
                                         <span><i className="fas fa-clock text-emerald-500 mr-1"></i> {event.time}</span>
                                     </div>
                                     <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                                 </div>
                                 <div className="flex items-center justify-between">
                                     <span className="text-xs text-gray-500"><i className="fas fa-map-pin mr-1"></i> {event.location}</span>
                                     <button className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">RSVP Details &rarr;</button>
                                 </div>
                             </div>
                         </div>
                     ))}
                     {events.length === 0 && (
                        <div className="bg-white p-8 text-center rounded-xl border border-gray-100">
                            <p className="text-gray-500">No upcoming events listed.</p>
                        </div>
                     )}
                 </div>
    
                 {/* Right Column: Donation Chart */}
                 <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                             <i className="fas fa-hand-holding-heart text-gold-500 mr-2"></i>
                             Charity Goals
                         </h3>
                         <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={donations} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px', fontWeight: 500 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{fill: '#f0fdf4'}}
                                    />
                                    <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} name="Raised ($)" />
                                    <Bar dataKey="goal" fill="#e5e7eb" radius={[0, 4, 4, 0]} barSize={20} name="Goal ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-4 text-center">
                             <button className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                 Donate Now
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

const AboutPage = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            <i className="fas fa-mosque"></i>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">About AmcaConnect</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
            AmcaConnect is dedicated to leveraging technology to strengthen the bonds of the Muslim community. 
            We believe in providing accessible, trustworthy, and beneficial resources that cater to the spiritual 
            and social needs of believers in the modern world.
        </p>
        <p className="text-gray-600 mb-8 leading-relaxed">
            From accurate prayer timings and event management to AI-powered knowledge assistance, 
            our platform is designed with Ihsan (excellence) in mind.
        </p>
        <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><i className="fab fa-twitter text-xl"></i></a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><i className="fab fa-facebook text-xl"></i></a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><i className="fab fa-instagram text-xl"></i></a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition-colors"><i className="fas fa-envelope text-xl"></i></a>
        </div>
    </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize default data
    dataService.init();
    
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch(currentPage) {
        case 'home': return <Home />;
        case 'qibla': return <QiblaFinder />;
        case 'articles': return <ArticlesPage />;
        case 'events': return <EventsPage />;
        case 'about': return <AboutPage />;
        case 'admin': return <AdminDashboard />;
        case 'auth': return <AuthPage onLoginSuccess={handleLoginSuccess} />;
        default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-20 md:pb-0">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            {renderPage()}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center text-sm text-gray-500 hidden md:block">
            <p>&copy; 2024 AmcaConnect. All Rights Reserved.</p>
        </footer>

        <AssistantChat />
    </div>
  );
};

export default App;