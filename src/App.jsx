import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import TournamentList from './components/TournamentList.jsx';
import UserPanel from './components/UserPanel.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function seedTournaments() {
  const now = Date.now();
  return [
    {
      id: 't1',
      name: 'Championship Qualifier',
      date: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
      mode: 'Squad',
      maxSlots: 48,
      prizePool: 5000,
      entryFee: 50,
      slotsFilled: 22,
      status: 'Upcoming',
    },
    {
      id: 't2',
      name: 'Midnight Rush',
      date: new Date(now - 10 * 60 * 1000).toISOString(),
      mode: 'Duo',
      maxSlots: 40,
      prizePool: 3000,
      entryFee: 30,
      slotsFilled: 36,
      status: 'Live',
    },
    {
      id: 't3',
      name: 'Solo Kings Cup',
      date: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      mode: 'Solo',
      maxSlots: 100,
      prizePool: 7000,
      entryFee: 20,
      slotsFilled: 100,
      status: 'Completed',
    },
  ];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tournaments, setTournaments] = useState(seedTournaments());
  const [registrations, setRegistrations] = useState({}); // { [tournamentId]: [{playerName, playerId, teamName}] }

  const sortedTournaments = useMemo(() => {
    const order = { Live: 0, Upcoming: 1, Completed: 2 };
    return [...tournaments].sort((a, b) => (order[a.status] - order[b.status]) || new Date(a.date) - new Date(b.date));
  }, [tournaments]);

  const handleJoin = (t, player) => {
    setRegistrations((prev) => {
      const list = prev[t.id] ? [...prev[t.id]] : [];
      if (list.length >= t.maxSlots) return prev; // safety
      const data = { ...(player || {}), joinedAt: new Date().toISOString() };
      list.push(data);
      return { ...prev, [t.id]: list };
    });
    setTournaments((prev) => prev.map((x) => (x.id === t.id ? { ...x, slotsFilled: Math.min(x.slotsFilled + 1, x.maxSlots) } : x)));
  };

  const handleCreateTournament = (payload) => {
    const id = 't' + Math.random().toString(36).slice(2, 8);
    const newT = {
      id,
      name: payload.name,
      date: payload.date,
      mode: payload.mode,
      maxSlots: payload.maxSlots,
      prizePool: payload.prizePool,
      entryFee: payload.entryFee,
      slotsFilled: 0,
      status: 'Upcoming',
    };
    setTournaments((prev) => [newT, ...prev]);
  };

  const handleStatusChange = (id, status) => {
    setTournaments((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleDelete = (id) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setRegistrations((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 text-slate-800">
      <Navbar activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'home' && (
        <>
          <Hero />
          <TournamentList tournaments={sortedTournaments} onJoin={handleJoin} />
        </>
      )}

      {activeTab === 'user' && (
        <UserPanel tournaments={sortedTournaments} onJoin={handleJoin} />
      )}

      {activeTab === 'admin' && (
        <AdminPanel
          tournaments={sortedTournaments}
          registrations={registrations}
          onCreate={handleCreateTournament}
          onStatus={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Host and join Free Fire tournaments with ease
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            Create events, manage registrations, and go live. Built for squads, duos, and solo grinders.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium">
              Explore Tournaments
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-medium">
              How it works
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg" />
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.18),transparent_45%)] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Free Fire Arena. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-700" href="#" onClick={(e) => e.preventDefault()}>Rules</a>
          <a className="hover:text-slate-700" href="#" onClick={(e) => e.preventDefault()}>Support</a>
          <a className="hover:text-slate-700" href="#" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>
      </div>
    </footer>
  );
}
