
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Event, Article, DonationItem, Leader, SiteConfig } from '../types';

const AdminDashboard: React.FC<{ isAuthenticated: boolean; onAuthenticated: () => void; onLogout: () => void }> = ({ isAuthenticated, onAuthenticated, onLogout }) => {
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'articles' | 'donations' | 'leaders' | 'pages'>('events');

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-50 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Admin Access</h2>
          <p className="text-gray-500 mb-6 text-sm">Enter the PIN to manage portal content.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (pin === '7860') onAuthenticated();
            else alert('Invalid PIN (Hint: 7860)');
          }}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-widest text-2xl p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
              placeholder="••••"
              maxLength={4}
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold">Content Management System</h2>
          <button onClick={onLogout} className="text-gray-400 hover:text-white">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-slate-50 overflow-x-auto">
          <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} label="Events" icon="fa-calendar-alt" />
          <TabButton active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} label="Articles" icon="fa-newspaper" />
          <TabButton active={activeTab === 'donations'} onClick={() => setActiveTab('donations')} label="Donations" icon="fa-hand-holding-heart" />
          <TabButton active={activeTab === 'leaders'} onClick={() => setActiveTab('leaders')} label="Leadership" icon="fa-users-cog" />
          <TabButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} label="Site Pages" icon="fa-edit" />
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'events' && <EventManager />}
          {activeTab === 'articles' && <ArticleManager />}
          {activeTab === 'donations' && <DonationManager />}
          {activeTab === 'leaders' && <LeadershipManager />}
          {activeTab === 'pages' && <PageContentManager />}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-[120px] py-4 text-sm font-medium transition-colors flex items-center justify-center space-x-2 border-b-2 ${
      active
        ? 'border-emerald-600 text-emerald-600 bg-white'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    }`}
  >
    <i className={`fas ${icon}`}></i>
    <span>{label}</span>
  </button>
);

// --- Sub-components for managing specific entities ---

const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Partial<Event> | null>(null);

  useEffect(() => {
    setEvents(dataService.getEvents());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    
    // Basic validation
    if (!editing.title || !editing.date) return alert('Title and Date are required');

    dataService.saveEvent(editing as Event);
    setEvents(dataService.getEvents());
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this event?')) {
      dataService.deleteEvent(id);
      setEvents(dataService.getEvents());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Manage Events</h3>
        <button 
          onClick={() => setEditing({ category: 'Social' })} // Default state for new
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
        >
          <i className="fas fa-plus mr-2"></i> Add Event
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold mb-4">{editing.id ? 'Edit Event' : 'New Event'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Title" value={editing.title} onChange={v => setEditing({...editing, title: v})} />
            <Input label="Date" type="date" value={editing.date} onChange={v => setEditing({...editing, date: v})} />
            <Input label="Time" value={editing.time} onChange={v => setEditing({...editing, time: v})} />
            <Input label="Location" value={editing.location} onChange={v => setEditing({...editing, location: v})} />
            <Select label="Category" value={editing.category} onChange={v => setEditing({...editing, category: v as any})} options={['Social', 'Religious', 'Education', 'Charity']} />
            <Input label="Image URL" value={editing.imageUrl} onChange={v => setEditing({...editing, imageUrl: v})} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea 
              value={editing.description || ''} 
              onChange={e => setEditing({...editing, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Event</button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{ev.title}</td>
                  <td className="p-3 text-gray-500">{ev.date}</td>
                  <td className="p-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">{ev.category}</span></td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => setEditing(ev)} className="text-blue-600 hover:text-blue-800"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(ev.id)} className="text-red-600 hover:text-red-800"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);

  useEffect(() => {
    setArticles(dataService.getArticles());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title) return alert('Title is required');
    
    // Ensure tags is array
    if (typeof editing.tags === 'string') {
        editing.tags = (editing.tags as string).split(',').map((t: string) => t.trim());
    }

    dataService.saveArticle(editing as Article);
    setArticles(dataService.getArticles());
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this article?')) {
      dataService.deleteArticle(id);
      setArticles(dataService.getArticles());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Manage Articles</h3>
        <button 
          onClick={() => setEditing({ tags: [] })} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
        >
          <i className="fas fa-plus mr-2"></i> Write Article
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold mb-4">{editing.id ? 'Edit Article' : 'New Article'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Title" value={editing.title} onChange={v => setEditing({...editing, title: v})} />
            <Input label="Author" value={editing.author} onChange={v => setEditing({...editing, author: v})} />
            <Input label="Date" type="text" value={editing.date} onChange={v => setEditing({...editing, date: v})} />
            <Input label="Image URL" value={editing.imageUrl} onChange={v => setEditing({...editing, imageUrl: v})} />
          </div>
          <div className="mb-4">
            <Input label="Tags (comma separated)" value={Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags} onChange={v => setEditing({...editing, tags: v})} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Excerpt</label>
            <textarea 
              value={editing.excerpt || ''} 
              onChange={e => setEditing({...editing, excerpt: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
              rows={2}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Content</label>
            <textarea 
              value={editing.content || ''} 
              onChange={e => setEditing({...editing, content: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              rows={8}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Article</button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map(art => (
                <tr key={art.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{art.title}</td>
                  <td className="p-3 text-gray-500">{art.author}</td>
                  <td className="p-3 text-gray-500">{art.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => setEditing(art)} className="text-blue-600 hover:text-blue-800"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(art.id)} className="text-red-600 hover:text-red-800"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const DonationManager = () => {
    const [donations, setDonations] = useState<DonationItem[]>([]);
    const [editing, setEditing] = useState<Partial<DonationItem> | null>(null);

    useEffect(() => {
        setDonations(dataService.getDonations());
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        dataService.saveDonation(editing as DonationItem);
        setDonations(dataService.getDonations());
        setEditing(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Remove this cause?')) {
            dataService.deleteDonation(id);
            setDonations(dataService.getDonations());
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Manage Donations</h3>
                <button 
                onClick={() => setEditing({})} 
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
                >
                <i className="fas fa-plus mr-2"></i> Add Cause
                </button>
            </div>

            {editing ? (
                <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="font-bold mb-4">{editing.id ? 'Edit Cause' : 'New Cause'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input label="Cause Name" value={editing.name} onChange={v => setEditing({...editing, name: v})} />
                        <Input label="Amount Raised ($)" type="number" value={editing.amount} onChange={v => setEditing({...editing, amount: Number(v)})} />
                        <Input label="Goal ($)" type="number" value={editing.goal} onChange={v => setEditing({...editing, goal: Number(v)})} />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Cause</button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donations.map(d => (
                        <div key={d.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-lg mb-2">{d.name}</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Raised:</span> <span className="font-medium text-emerald-600">${d.amount?.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Goal:</span> <span className="font-medium text-gray-600">${d.goal?.toLocaleString()}</span></div>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div 
                                            className="bg-emerald-500 h-2 rounded-full" 
                                            style={{ width: `${Math.min(100, ((d.amount || 0) / (d.goal || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                                <button onClick={() => setEditing(d)} className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                                <button onClick={() => handleDelete(d.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeadershipManager = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [editing, setEditing] = useState<Partial<Leader> | null>(null);

  useEffect(() => {
    setLeaders(dataService.getLeaders());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name || !editing.role) return alert('Name and Role are required');
    dataService.saveLeader(editing as Leader);
    setLeaders(dataService.getLeaders());
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this leader?')) {
      dataService.deleteLeader(id);
      setLeaders(dataService.getLeaders());
    }
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Manage Leadership</h3>
        <button 
          onClick={() => setEditing({})} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
        >
          <i className="fas fa-plus mr-2"></i> Add Leader
        </button>
      </div>

      {editing ? (
         <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold mb-4">{editing.id ? 'Edit Leader' : 'New Leader'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Name" value={editing.name} onChange={v => setEditing({...editing, name: v})} />
            <Input label="Role" value={editing.role} onChange={v => setEditing({...editing, role: v})} />
            <Input label="Image URL" value={editing.imageUrl} onChange={v => setEditing({...editing, imageUrl: v})} />
            <div className="md:col-span-2">
                <Input label="Description" value={editing.description} onChange={v => setEditing({...editing, description: v})} />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save</button>
          </div>
        </form>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map(leader => (
              <div key={leader.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                 <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 overflow-hidden">
                    <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover" />
                 </div>
                 <h4 className="font-bold text-gray-800">{leader.name}</h4>
                 <p className="text-emerald-600 text-xs mb-2">{leader.role}</p>
                 <div className="space-x-2 mt-4">
                    <button onClick={() => setEditing(leader)} className="text-blue-600 text-sm hover:underline">Edit</button>
                    <button onClick={() => handleDelete(leader.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                 </div>
              </div>
            ))}
         </div>
      )}
    </div>
  );
};

const PageContentManager = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    setConfig(dataService.getSiteConfig());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      dataService.saveSiteConfig(config);
      alert("Site content updated successfully!");
    }
  };

  const updateConfig = (path: string, value: any) => {
    if (!config) return;
    const [section, field] = path.split('.');
    
    if (section === 'about' && field === 'mission') {
        // Handle array for mission
        const newConfig = { ...config };
        newConfig.about.mission = value.split('\n');
        setConfig(newConfig);
        return;
    }

    setConfig({
      ...config,
      [section]: {
        ...(config as any)[section],
        [field]: value
      }
    });
  };

  if (!config) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8">
       {/* Hero Section */}
       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">Hero Section (Home)</h3>
          <div className="space-y-4">
             <Input label="Title Tag" value={config.hero.title} onChange={v => updateConfig('hero.title', v)} />
             <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Quote</label>
                 <textarea value={config.hero.quote} onChange={e => updateConfig('hero.quote', e.target.value)} className="w-full p-2 border border-gray-300 rounded" rows={2} />
             </div>
             <Input label="Reference / Subtext" value={config.hero.reference} onChange={v => updateConfig('hero.reference', v)} />
          </div>
       </div>

       {/* About Page */}
       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">About Page</h3>
          <div className="space-y-4">
             <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (Main Text)</label>
                 <textarea value={config.about.description} onChange={e => updateConfig('about.description', e.target.value)} className="w-full p-2 border border-gray-300 rounded" rows={4} />
             </div>
             <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vision Statement</label>
                 <textarea value={config.about.vision} onChange={e => updateConfig('about.vision', e.target.value)} className="w-full p-2 border border-gray-300 rounded" rows={2} />
             </div>
             <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mission Points (One per line)</label>
                 <textarea value={config.about.mission.join('\n')} onChange={e => updateConfig('about.mission', e.target.value)} className="w-full p-2 border border-gray-300 rounded" rows={4} />
             </div>
          </div>
       </div>

       {/* Contact Info */}
       <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <Input label="Address" value={config.contact.address} onChange={v => updateConfig('contact.address', v)} />
             </div>
             <Input label="Phone" value={config.contact.phone} onChange={v => updateConfig('contact.phone', v)} />
             <Input label="Email" value={config.contact.email} onChange={v => updateConfig('contact.email', v)} />
             <div className="md:col-span-2">
                <Input label="Google Maps Embed URL" value={config.contact.mapUrl} onChange={v => updateConfig('contact.mapUrl', v)} />
                <p className="text-xs text-gray-500 mt-1">Paste the 'src' attribute from Google Maps Embed code.</p>
             </div>
          </div>
       </div>

       <div className="flex justify-end">
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-lg">Save All Changes</button>
       </div>
    </form>
  );
};

// UI Helpers
const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{label}</label>
    <input 
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm"
    />
  </div>
);

const Select = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{label}</label>
    <select 
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500 text-sm"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default AdminDashboard;
