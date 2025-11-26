import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    dob: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = authService.login(loginEmail, loginPassword);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = authService.register(formData);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 1000);
  };

  const updateForm = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Left Side - Visual */}
        <div className="md:w-5/12 bg-emerald-800 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/50 to-emerald-900/50"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h2>
            <p className="text-emerald-100 leading-relaxed">
              {isLogin 
                ? "Access your profile, manage event registrations, and stay connected with your local community."
                : "Become a member of UmmahConnect to unlock exclusive resources, register for events, and be part of a growing digital family."
              }
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm italic">"The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy."</p>
              <p className="text-xs font-bold mt-2 text-gold-400">— Quran 49:10</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
            {isLogin ? "Sign In to your Account" : "Create New Account"}
          </h3>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-lock"></i>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-70"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => updateForm('email', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                   <select value={formData.gender} onChange={(e) => updateForm('gender', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                     <option>Male</option>
                     <option>Female</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                   <input type="date" value={formData.dob} onChange={(e) => updateForm('dob', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                <input type="text" placeholder="Street Address" value={formData.address.street} onChange={(e) => updateForm('address.street', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 mb-2" />
                <div className="grid grid-cols-3 gap-2">
                   <input type="text" placeholder="City" value={formData.address.city} onChange={(e) => updateForm('address.city', e.target.value)} className="col-span-1 p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                   <input type="text" placeholder="State" value={formData.address.state} onChange={(e) => updateForm('address.state', e.target.value)} className="col-span-1 p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                   <input type="text" placeholder="Zip" value={formData.address.zip} onChange={(e) => updateForm('address.zip', e.target.value)} className="col-span-1 p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                  <input type="password" required value={formData.password} onChange={(e) => updateForm('password', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
                  <input type="password" required value={formData.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4 disabled:opacity-70"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;