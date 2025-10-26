import React from 'react';
import { Users, Trophy } from 'lucide-react';

function StatusPill({ status }) {
  const map = {
    Upcoming: 'bg-amber-100 text-amber-700',
    Live: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export default function TournamentList({ tournaments, onJoin }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-indigo-600" /> Upcoming & Live Tournaments
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <article key={t.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{t.name}</h3>
                <div className="text-sm text-slate-500">{new Date(t.date).toLocaleString()}</div>
              </div>
              <StatusPill status={t.status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4 text-slate-400" />
                <span>
                  {t.slotsFilled}/{t.maxSlots} slots
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Prize</span>
                <div className="font-medium text-slate-800">₹{t.prizePool.toLocaleString()}</div>
              </div>
              <div className="text-slate-600">Mode: {t.mode}</div>
              <div className="text-right text-slate-600">Entry: ₹{t.entryFee}</div>
            </dl>
            <button
              disabled={t.status !== 'Upcoming' || t.slotsFilled >= t.maxSlots}
              onClick={() => onJoin(t)}
              className={`mt-4 w-full inline-flex justify-center items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                t.status === 'Upcoming' && t.slotsFilled < t.maxSlots
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Join Tournament
            </button>
          </article>
        ))}
        {tournaments.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10 border border-dashed rounded-lg">
            No tournaments yet. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
