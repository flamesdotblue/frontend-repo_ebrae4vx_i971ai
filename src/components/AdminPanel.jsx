import React, { useMemo, useState } from 'react';
import { PlusCircle, Settings, PlayCircle, CheckCircle2, Trash2, Users } from 'lucide-react';

export default function AdminPanel({ tournaments, registrations, onCreate, onStatus, onDelete }) {
  const [name, setName] = useState('Daily Squad Clash');
  const [date, setDate] = useState(() => new Date(Date.now() + 3600_000).toISOString().slice(0, 16));
  const [mode, setMode] = useState('Squad');
  const [maxSlots, setMaxSlots] = useState(48);
  const [prizePool, setPrizePool] = useState(1000);
  const [entryFee, setEntryFee] = useState(20);

  const stats = useMemo(() => {
    const totalRegs = Object.values(registrations).reduce((a, arr) => a + (arr?.length || 0), 0);
    const upcoming = tournaments.filter((t) => t.status === 'Upcoming').length;
    const live = tournaments.filter((t) => t.status === 'Live').length;
    return { totalRegs, upcoming, live };
  }, [registrations, tournaments]);

  const handleCreate = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      date: new Date(date).toISOString(),
      mode,
      maxSlots: Number(maxSlots),
      prizePool: Number(prizePool),
      entryFee: Number(entryFee),
    };
    if (!payload.name || isNaN(payload.maxSlots) || payload.maxSlots <= 0) return;
    onCreate(payload);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs uppercase text-slate-500">Upcoming</div>
          <div className="text-2xl font-semibold text-slate-800">{stats.upcoming}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs uppercase text-slate-500">Live</div>
          <div className="text-2xl font-semibold text-slate-800">{stats.live}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs uppercase text-slate-500">Registrations</div>
          <div className="text-2xl font-semibold text-slate-800">{stats.totalRegs}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-600" /> Create Tournament
        </h3>
        <form onSubmit={handleCreate} className="grid lg:grid-cols-6 gap-4">
          <input className="lg:col-span-2 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="datetime-local" className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={date} onChange={(e) => setDate(e.target.value)} />
          <select className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Solo</option>
            <option>Duo</option>
            <option>Squad</option>
          </select>
          <input type="number" min={1} className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Max Slots" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} />
          <input type="number" min={0} className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Prize Pool" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} />
          <input type="number" min={0} className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Entry Fee" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
          <div className="lg:col-span-6 flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium">
              <PlusCircle className="h-4 w-4" /> Create
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Manage Tournaments</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Name</th>
                <th className="py-2">Schedule</th>
                <th className="py-2">Mode</th>
                <th className="py-2">Slots</th>
                <th className="py-2">Prize</th>
                <th className="py-2">Entry</th>
                <th className="py-2">Status</th>
                <th className="py-2">Players</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{t.name}</td>
                  <td className="py-3 text-slate-600">{new Date(t.date).toLocaleString()}</td>
                  <td className="py-3 text-slate-600">{t.mode}</td>
                  <td className="py-3 text-slate-600">{t.slotsFilled}/{t.maxSlots}</td>
                  <td className="py-3 text-slate-600">₹{t.prizePool.toLocaleString()}</td>
                  <td className="py-3 text-slate-600">₹{t.entryFee}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'Live' ? 'bg-emerald-100 text-emerald-700' : t.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>{t.status}</span>
                  </td>
                  <td className="py-3 text-slate-600 flex items-center gap-1"><Users className="h-4 w-4 text-slate-400" />{registrations[t.id]?.length || 0}</td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button title="Start" onClick={() => onStatus(t.id, 'Live')} disabled={t.status !== 'Upcoming'} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${t.status === 'Upcoming' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        <PlayCircle className="h-4 w-4" /> Start
                      </button>
                      <button title="Complete" onClick={() => onStatus(t.id, 'Completed')} disabled={t.status === 'Completed'} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${t.status !== 'Completed' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        <CheckCircle2 className="h-4 w-4" /> Complete
                      </button>
                      <button title="Delete" onClick={() => onDelete(t.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-rose-600 text-white">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">No tournaments created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
