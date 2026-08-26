import { useEffect, useState } from "react";
import { Trash2, Phone, Mail, MessageSquare, Check } from "lucide-react";
import { LeadsAPI } from "../../api";

function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.max(1, Math.round((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s/60)}m ago`;
  if (s < 86400) return `${Math.round(s/3600)}h ago`;
  return `${Math.round(s/86400)}d ago`;
}

export default function LeadsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setItems(await LeadsAPI.list()); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const markRead = async (l) => { await LeadsAPI.markRead(l.id); await load(); };
  const del = async (l) => { if (window.confirm("Delete this lead?")) { await LeadsAPI.remove(l.id); await load(); } };

  const unread = items.filter(i => !i.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-black text-3xl">Leads</h2>
          <p className="text-neutral-500 text-sm mt-1">{items.length} total · <span className="text-red-500">{unread} unread</span></p>
        </div>
      </div>

      {loading ? <p className="text-neutral-500">Loading...</p> : items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-xl">
          <MessageSquare className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">No leads yet. Submissions from the contact and financing forms will show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.id} className={`p-5 rounded-xl border ${l.read ? "border-neutral-800 bg-neutral-900/50" : "border-red-800/40 bg-red-950/10"}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!l.read && <span className="px-2 py-0.5 text-[10px] bg-red-600 rounded uppercase font-bold">New</span>}
                    <span className="text-xs uppercase tracking-wider text-neutral-500">{l.kind === "financing" ? "Financing Application" : "Contact Message"}</span>
                  </div>
                  <p className="font-display font-bold text-lg text-white mt-1">{l.first_name || l.name || "Unknown"} {l.last_name || ""}</p>
                </div>
                <span className="text-xs text-neutral-500 whitespace-nowrap">{timeAgo(l.created_at)}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                {l.phone && <a href={`tel:${l.phone}`} className="text-neutral-300 hover:text-red-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {l.phone}</a>}
                {l.email && <a href={`mailto:${l.email}`} className="text-neutral-300 hover:text-red-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {l.email}</a>}
              </div>

              {l.kind === "financing" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                  {l.income && <div><span className="text-neutral-500">Income:</span> <span className="text-white">${l.income}/mo</span></div>}
                  {l.employment && <div><span className="text-neutral-500">Employment:</span> <span className="text-white">{l.employment}</span></div>}
                  {l.down_payment && <div><span className="text-neutral-500">Down:</span> <span className="text-white">${l.down_payment}</span></div>}
                </div>
              )}

              {(l.message || l.comment) && <p className="text-neutral-300 text-sm bg-neutral-950/50 rounded-lg p-3 border border-neutral-800">“{l.message || l.comment}”</p>}

              <div className="flex gap-2 mt-4">
                {!l.read && <button onClick={() => markRead(l)} className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Mark as read</button>}
                <button onClick={() => del(l)} className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
