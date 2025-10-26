import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import TournamentList from './components/TournamentList';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tournaments, setTournaments] = useState([
    {
      id: 't-1001',
      name: 'Booyah Bash #1',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      prizePool: 10000,
      maxSlots: 48,
      slotsFilled: 12,
      entryFee: 30,
      status: 'Upcoming',
      mode: 'Squad',
    },
    {
      id: 't-1002',
      name: 'Rapid Fire Cup',
      date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      prizePool: 5000,
      maxSlots: 24,
      slotsFilled: 24,
      entryFee: 20,
      status: 'Upcoming',
      mode: 'Duo',
    },
    {
      id: 't-1000',
      name: 'Night Ops Showdown',
      date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      prizePool: 8000,
      maxSlots: 48,
      slotsFilled: 48,
      entryFee: 25,
      status: 'Completed',
      mode: 'Solo',
    },
  ]);

  const visibleTournaments = useMemo(
    () => tournaments.filter((t) => t.status !== 'Completed'),
    [tournaments]
  );

  const handleJoin = (tournament, player) => {
    // In a real app, send this to the backend. Here we just update slot count.
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournament.id
          ? { ...t, slotsFilled: Math.min(t.slotsFilled + 1, t.maxSlots) }
          : t
      )
    );
    alert(
      player
        ? `Registered ${player.playerName} for ${tournament.name}!`
        : `Joined ${tournament.name}!`
    );
  };

  const handleCreate = (payload) => {
    const id = `t-${Math.random().toString(36).slice(2, 8)}`;
    setTournaments((prev) => [
      {
        id,
        name: payload.name,
        date: new Date(payload.date).toISOString(),
        prizePool: Number(payload.prizePool) || 0,
        maxSlots: Number(payload.maxSlots) || 0,
        slotsFilled: 0,
        entryFee: Number(payload.entryFee) || 0,
        status: 'Upcoming',
        mode: payload.mode || 'Solo',
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTournaments((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Navbar activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'home' && (
        <>
          <Hero onExplore={() => setActiveTab('user')} />
          <TournamentList tournaments={visibleTournaments} onJoin={handleJoin} />
        </>
      )}

      {activeTab === 'user' && (
        <UserPanel tournaments={tournaments} onJoin={handleJoin} />
      )}

      {activeTab === 'admin' && (
        <AdminPanel
          tournaments={tournaments}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <Footer />
    </div>
  );
}

function Hero({ onExplore }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(167,139,250,0.15),transparent_50%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Host and join Free Fire tournaments with ease
            </h1>
            <p className="mt-3 text-slate-600">
              Create brackets, manage slots, and compete for the top spot. An elegant admin panel for organizers and a smooth player experience for everyone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onExplore} className="px-5 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium">
                Register as Player
              </button>
              <a href="#tournaments" className="px-5 py-2.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-medium text-slate-700">
                View Tournaments
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-200/40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} Free Fire Arena</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-700" href="#">Rules</a>
          <a className="hover:text-slate-700" href="#">Support</a>
          <a className="hover:text-slate-700" href="#">Community</a>
        </div>
      </div>
    </footer>
  );
}
