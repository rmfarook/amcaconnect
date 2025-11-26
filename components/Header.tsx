import React, { useState } from 'react';
import { User, MenuItem } from '../types';

interface HeaderProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuStructure: MenuItem[] = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { 
      id: 'about', 
      label: 'About', 
      icon: 'fa-info-circle',
      children: [
        { id: 'about-community', label: 'About the Community' },
        { id: 'leadership', label: 'Leadership' }
      ]
    },
    { 
      id: 'prayer', 
      label: 'Prayer', 
      icon: 'fa-mosque',
      children: [
        { id: 'prayer-times', label: 'Prayer Timings' },
        { id: 'qibla', label: 'Qibla Finder' }
      ]
    },
    { 
      id: 'knowledge', 
      label: 'Knowledge', 
      icon: 'fa-book-open',
      children: [
        { id: 'maktab', label: 'Maktab Madaras (Kids)' },
        { id: 'quran-class', label: 'Quran Class (Elders)' },
        { id: 'articles', label: 'Islamic Articles' }
      ]
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: 'fa-calendar-alt',
      children: [
        { id: 'events-upcoming', label: 'Upcoming Events' },
        { id: 'youth', label: 'Youth Program' },
        { id: 'sisters', label: 'Sisters’ Program' }
      ]
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: 'fa-hand-holding-heart',
      children: [
        { id: 'nikah', label: 'Nikah Hall' },
        { id: 'counseling', label: 'Counseling & Support' },
        { id: 'education-assist', label: 'Education Support' },
        { id: 'career', label: 'Career Guidance' },
        { id: 'charity', label: 'Charity Drives' }
      ]
    },
    { 
      id: 'media', 
      label: 'Media', 
      icon: 'fa-photo-video',
      children: [
        { id: 'media-gallery', label: 'Photo / Video Gallery' },
        { id: 'announcements', label: 'Announcements' }
      ]
    },
    { 
      id: 'donate', 
      label: 'Donate', 
      icon: 'fa-donate',
      children: [
        { id: 'donate-zakat', label: 'Pay Zakat' },
        { id: 'donate-sadaqah', label: 'Sadaqah' },
        { id: 'donate-online', label: 'Online Payment' }
      ]
    },
    { id: 'contact', label: 'Contact', icon: 'fa-envelope' },
  ];

  const handleNavClick = (itemId: string, hasChildren: boolean) => {
    if (!hasChildren) {
      setCurrentPage(itemId);
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    } else {
      // For mobile toggle or if clicking parent in desktop
      setActiveDropdown(activeDropdown === itemId ? null : itemId);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 font-sans">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group flex-shrink-0 mr-2"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-lg lg:text-xl mr-2 group-hover:bg-emerald-700 transition-colors">
              <i className="fas fa-mosque"></i>
            </div>
            <div className="hidden sm:block">
                <h1 className="text-lg lg:text-2xl font-bold text-gray-800 font-serif leading-none">AmcaConnect</h1>
                <p className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-widest">Community Portal</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-1 items-center flex-1 justify-center">
            {menuStructure.map((item) => (
              <div 
                key={item.id} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick(item.id, !!item.children)}
                  className={`px-3 py-2 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center space-x-1 whitespace-nowrap ${
                    currentPage.startsWith(item.id) || (item.children && item.children.some(c => c.id === currentPage))
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <i className={`fas ${item.icon} mr-1.5 text-lg ${
                      currentPage.startsWith(item.id) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'
                  }`}></i>}
                  <span>{item.label}</span>
                  {item.children && <i className="fas fa-chevron-down text-[9px] ml-0.5 opacity-50"></i>}
                </button>

                {/* Dropdown */}
                {item.children && (
                    <div className="absolute top-full left-0 w-52 bg-white shadow-lg rounded-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                        {item.children.map(child => (
                            <button
                                key={child.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPage(child.id);
                                    setActiveDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border-b border-gray-50 last:border-0"
                            >
                                {child.label}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side: Auth / Profile */}
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-gray-200 ml-2 flex-shrink-0">
             {user ? (
                 <div className="relative group">
                    <button 
                        className="flex items-center space-x-2 pl-3 pr-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                    </button>
                    
                    {/* Profile Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                        </div>
                        <button 
                            onClick={() => setCurrentPage('admin')} 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <i className="fas fa-cog mr-2 text-gray-400"></i> Admin Access
                        </button>
                        <button 
                            onClick={onLogout} 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                        </button>
                    </div>
                 </div>
             ) : (
                <div className="relative group">
                    <button 
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <i className="fas fa-user text-xs"></i>
                        <span>Login</span>
                        <i className="fas fa-chevron-down text-[10px] ml-1 opacity-80"></i>
                    </button>

                    {/* Auth Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform translate-y-2 group-hover:translate-y-0">
                        <button 
                            onClick={() => setCurrentPage('auth')}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center border-b border-gray-50"
                        >
                            <i className="fas fa-users mr-3 text-emerald-500 w-4"></i>
                            <div>
                                <span className="font-semibold block">Member Login</span>
                                <span className="text-xs text-gray-400">For community members</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => setCurrentPage('admin')}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center"
                        >
                            <i className="fas fa-user-shield mr-3 text-gray-500 w-4"></i>
                            <div>
                                <span className="font-semibold block">Admin Login</span>
                                <span className="text-xs text-gray-400">For site management</span>
                            </div>
                        </button>
                    </div>
                </div>
             )}
             
             {/* Mobile Menu Button */}
             <div className="xl:hidden flex items-center">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-600 hover:text-emerald-600 p-2 ml-2"
                >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                </button>
             </div>
          </div>
        
          {/* Mobile Only (Small Screens) */}
          <div className="md:hidden flex items-center">
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-emerald-600 p-2"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white pt-24 px-6 overflow-y-auto animate-fade-in">
             <div className="space-y-4 pb-20">
                {menuStructure.map((item) => (
                    <div key={item.id} className="border-b border-gray-100 last:border-0 pb-2">
                        <button 
                            onClick={() => handleNavClick(item.id, !!item.children)}
                            className="flex items-center justify-between w-full py-2 text-lg font-medium text-gray-800"
                        >
                            <span className="flex items-center">
                                <i className={`fas ${item.icon} w-8 text-emerald-500`}></i>
                                {item.label}
                            </span>
                            {item.children && (
                                <i className={`fas fa-chevron-down transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`}></i>
                            )}
                        </button>
                        
                        {/* Mobile Submenu */}
                        {item.children && activeDropdown === item.id && (
                            <div className="pl-8 mt-2 space-y-2 bg-gray-50 rounded-lg p-4">
                                {item.children.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => {
                                            setCurrentPage(child.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-gray-600 hover:text-emerald-600 text-sm"
                                    >
                                        {child.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {/* Auth for Mobile */}
                <div className="pt-6 border-t border-gray-100 mt-6">
                     {user ? (
                         <button onClick={onLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold">Sign Out</button>
                     ) : (
                         <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => { setCurrentPage('auth'); setMobileMenuOpen(false); }} className="bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm flex flex-col items-center justify-center">
                                <i className="fas fa-users mb-1 text-lg"></i>
                                Member Login
                             </button>
                             <button onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }} className="bg-gray-800 text-white py-3 rounded-lg font-bold text-sm flex flex-col items-center justify-center">
                                <i className="fas fa-user-shield mb-1 text-lg"></i>
                                Admin Login
                             </button>
                         </div>
                     )}
                </div>
             </div>
        </div>
      )}
    </header>
  );
};

export default Header;