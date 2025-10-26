import React, { useMemo, useState } from 'react';
import { Users } from 'lucide-react';

export default function UserPanel({ tournaments, onJoin }) {
  const upcoming = useMemo(
    () => tournaments.filter((t) => t.status === 'Upcoming' && t.slotsFilled < t.maxSlots),
    [tournaments]
  );
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id || '');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    const t = tournaments.find((x) => x.id === selectedId);
    if (t) {
      onJoin(t, { playerName, playerId, teamName });
      setPlayerName('');
      setPlayerId('');
      setTeamName('');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-indigo-600" /> Player Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Tournament</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            {upcoming.length === 0 && <option value="">No upcoming tournaments</option>}
            {upcoming.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {new Date(t.date).toLocaleString()} (Entry ₹{t.entryFee})
              </option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Player Name</label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your in-game name"
              required
              className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Player ID (UID)</label>
            <input
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="1234567890"
              required
              className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team Name (optional)</label>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Your squad name"
            className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedId}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
              selectedId ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Join
          </button>
        </div>
      </form>
      <p className="text-xs text-slate-500 mt-3">Note: This demo stores data locally. Backend integration can enable real registrations and payments.</p>
    </section>
  );
}
