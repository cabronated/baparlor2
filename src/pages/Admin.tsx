import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loginWithGoogle, logout } from '../lib/firebase';
import AdminInquiries from '../components/admin/AdminInquiries';
import AdminServices from '../components/admin/AdminServices';
import AdminPackages from '../components/admin/AdminPackages';
import AdminCategories from '../components/admin/AdminCategories';
import AdminSettings from '../components/admin/AdminSettings';
import AdminImages from '../components/admin/AdminImages';
import AdminPackageBuilder from '../components/admin/AdminPackageBuilder';

import AdminAIChat from '../components/admin/AdminAIChat';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('ai-assistant');

  if (loading) return <div className="pt-40 text-center pb-20">Loading...</div>;

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl md:text-5xl font-serif mb-12 border-b border-brand-black/10 pb-6 tracking-tight">Admin <span className="italic text-brand-gold font-light">Dashboard</span></h1>
      
      {!user ? (
        <div className="text-center py-20 bg-brand-ivory/50 border border-brand-black/5 shadow-sm p-10 max-w-lg mx-auto mt-20">
          <p className="mb-8 font-light text-brand-black/70 text-lg">You must be logged in to access the admin portal.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-brand-black text-brand-ivory px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-brand-gold transition-colors duration-300 shadow-xl"
          >
            Login with Google
          </button>
        </div>
      ) : !isAdmin ? (
        <div className="text-center py-20 bg-brand-ivory/50 border border-brand-black/5 shadow-sm p-10 max-w-lg mx-auto mt-20">
          <p className="mb-8 font-light text-brand-black/70 text-lg">Welcome {user.email}, but you are not authorized as an admin.</p>
          <button 
            onClick={logout}
            className="w-full border border-brand-black px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-brand-black hover:text-brand-ivory transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white border border-brand-black/5 shadow-sm p-6 mb-8">
              <p className="text-[10px] font-medium text-brand-black/50 tracking-widest uppercase mb-2">Logged in as</p>
              <p className="font-serif text-brand-gold truncate text-sm mb-4">{user.email}</p>
              <button 
                onClick={logout}
                className="text-[10px] uppercase tracking-[0.2em] font-medium border-b border-brand-black/30 hover:text-brand-gold hover:border-brand-gold transition-colors pb-1 w-full text-left"
              >
                Logout
              </button>
            </div>
            
            <nav className="flex flex-col border-l border-brand-black/10 pl-6 space-y-6">
              {[
                { id: 'ai-assistant', label: '✨ AI Assistant' },
                { id: 'services', label: 'Manage Services' },
                { id: 'categories', label: 'Manage Categories' },
                { id: 'packages', label: 'Premium Packages' },
                { id: 'builder', label: 'Custom Builder Settings' },
                { id: 'images', label: 'Global Images' },
                { id: 'settings', label: 'Global Content' },
                { id: 'inquiries', label: 'Past Inquiries (Local)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left text-sm tracking-wide uppercase transition-colors relative ${activeTab === tab.id ? 'text-brand-gold font-medium' : 'text-brand-black/60 hover:text-brand-black'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-[3px] h-full bg-brand-gold"></div>}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'ai-assistant' && <AdminAIChat />}
            {activeTab === 'inquiries' && <AdminInquiries />}
            { activeTab === 'services' && <AdminServices /> }
            { activeTab === 'categories' && <AdminCategories /> }
            { activeTab === 'packages' && <AdminPackages /> }
            { activeTab === 'builder' && <AdminPackageBuilder /> }
            { activeTab === 'images' && <AdminImages /> }
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      )}
    </div>
  );
}
