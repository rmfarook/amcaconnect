import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'qibla', label: 'Qibla', icon: 'fa-kaaba' },
    { id: 'articles', label: 'Knowledge', icon: 'fa-book-open' },
    { id: 'events', label: 'Community', icon: 'fa-users' },
    { id: 'about', label: 'About', icon: 'fa-info-circle' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl mr-3 group-hover:bg-emerald-700 transition-colors">
              <i className="fas fa-mosque"></i>
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 font-serif leading-none">UmmahConnect</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Community Portal</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                <i className={`fas ${item.icon} text-xs`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side: Auth / Admin */}
          <div className="hidden md:flex items-center space-x-3">
             {/* Admin Link (small) */}
             <button 
                onClick={() => setCurrentPage('admin')}
                className={`p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ${currentPage === 'admin' ? 'text-gray-800 bg-gray-100' : ''}`}
                title="Admin Portal"
             >
                 <i className="fas fa-cog"></i>
             </button>

             {user ? (
                 <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 pl-3 pr-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.firstName}</span>
                        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    
                    {/* Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                            </div>
                            <button 
                                onClick={() => { setIsProfileOpen(false); setCurrentPage('admin'); }} 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                                <i className="fas fa-user-circle mr-2 text-gray-400"></i> My Profile
                            </button>
                            <button 
                                onClick={() => { setIsProfileOpen(false); onLogout(); }} 
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                            </button>
                        </div>
                    )}
                 </div>
             ) : (
                 <button 
                    onClick={() => setCurrentPage('auth')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
                 >
                    Sign In
                 </button>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-emerald-600 p-2">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around border-t border-gray-100 bg-white py-2 fixed bottom-0 left-0 w-full z-50">
         {navItems.map((item) => (
            <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center p-2 ${
                currentPage === item.id ? 'text-emerald-600' : 'text-gray-400'
            }`}
            >
            <i className={`fas ${item.icon} text-lg mb-1`}></i>
            <span className="text-[10px]">{item.label}</span>
            </button>
        ))}
         <button
            onClick={() => setCurrentPage(user ? 'admin' : 'auth')}
            className={`flex flex-col items-center p-2 ${
                currentPage === 'auth' || currentPage === 'admin' ? 'text-emerald-600' : 'text-gray-400'
            }`}
        >
            <i className={`fas ${user ? 'fa-user' : 'fa-sign-in-alt'} text-lg mb-1`}></i>
            <span className="text-[10px]">{user ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;