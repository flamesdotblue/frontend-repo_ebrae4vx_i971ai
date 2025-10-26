import React from 'react';
import { Trophy, Users, Shield } from 'lucide-react';

const tabs = [
  { key: 'home', label: 'Tournaments', icon: Trophy },
  { key: 'user', label: 'Player', icon: Users },
  { key: 'admin', label: 'Admin', icon: Shield },
];

export default function Navbar({ activeTab, onChange }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="font-semibold text-slate-800 text-lg">Free Fire Arena</span>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  active
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
