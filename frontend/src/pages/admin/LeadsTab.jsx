import { useEffect, useState } from "react";
import { Trash2, Phone, Mail, MessageSquare, Check, MessageCircle, Copy, User, Briefcase, DollarSign, Car } from "lucide-react";
import { LeadsAPI } from "../../api";

function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.max(1, Math.round((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s/60)}m ago`;
  if (s < 86400) return `${Math.round(s/3600)}h ago`;
  return `${Math.round(s/86400)}d ago`;
}

function formatPhone(p) {
  if (!p) return "";
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  return p;
}

function digitsOnly(p) {
  return (p || "").replace(/\D/g, "");
}

// Templates for quick messages
const smsTemplates = {
  contact: (name) => `Hi ${name || "there"}, this is Xclusive Auto in Hanover, MD replying to your message. When's a good time to talk about the vehicle you asked about?`,
  financing: (name) => `Hi ${name || "there"}, thanks for applying with Xclusive Auto! Great news — we can help. What time works to go over your options?`,
};

const emailSubject = {
  contact: "Re: Your inquiry — Xclusive Auto LLC",
  financing: "Your financing application — Xclusive Auto LLC",
};

const emailBody = {
  contact: (name) => `Hi ${name || "there"},\n\nThanks for reaching out to Xclusive Auto LLC in Hanover, MD. I received your message and I'd love to help you find the right vehicle.\n\nWhen's a good time to give you a call?\n\nBest,\nXclusive Auto LLC\n(310) 591-0548`,
  financing: (name) => `Hi ${name || "there"},\n\nThanks for submitting your financing application with Xclusive Auto LLC — we've received it and I'll get back to you shortly with your approval details.\n\nFeel free to call us any time at (310) 591-0548.\n\nBest,\nXclusive Auto LLC`,
};

export default function LeadsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | contact | financing
  const [copied, setCopied] = useState("");

  const load = async () => {
    setLoading(true);
    try { setItems(await LeadsAPI.list()); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const markRead = async (l) => { await LeadsAPI.markRead(l.id); await load(); };
  const del = async (l) => { if (window.confirm("Delete this lead?")) { await LeadsAPI.remove(l.id); await load(); } };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  };

  const filtered = items.filter((l) => {
    if (filter === "unread") return !l.read;
    if (filter === "contact") return l.kind === "contact";
    if (filter === "financing") return l.kind === "financing";
    return true;
  });

  const unread = items.filter(i => !i.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-display font-black text-3xl">Customer Inquiries</h2>
          <p className="text-neutral-500 text-sm mt-1">{items.length} total · <span className="text-red-500">{unread} unread</span> · click any button below to reply</p>
        </div>
        <button onClick={load} className="text-xs text-neutral-400 hover:text-red-500 border border-neutral-800 hover:border-red-600 rounded-full px-4 py-2">↻ Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { k: "all", l: `All (${items.length})` },
          { k: "unread", l: `Unread (${unread})` },
          { k: "contact", l: `Messages (${items.filter(i=>i.kind==='contact').length})` },
          { k: "financing", l: `Applications (${items.filter(i=>i.kind==='financing').length})` },
        ].map((f) => (
          <button key={f.k} onClick={() => setFilter(f.k)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${filter === f.k ? "bg-red-600 border-red-600 text-white" : "border-neutral-800 text-neutral-400 hover:border-red-600 hover:text-white"}`}>
            {f.l}
          </button>
        ))}
      </div>

      {loading ? <p className="text-neutral-500">Loading...</p> : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-xl">
          <MessageSquare className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium">No inquiries yet</p>
          <p className="text-neutral-600 text-sm mt-1">When someone fills out the Contact or Financing form on your website, their info will land here with quick-reply buttons.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((l) => {
            const name = [l.first_name, l.last_name].filter(Boolean).join(" ") || l.name || "Unknown";
            const phone = digitsOnly(l.phone);
            const hasPhone = phone.length >= 10;
            const smsMessage = encodeURIComponent(smsTemplates[l.kind === "financing" ? "financing" : "contact"](l.first_name || l.name || ""));
            const emailMsg = encodeURIComponent(emailBody[l.kind === "financing" ? "financing" : "contact"](l.first_name || l.name || ""));
            const emailSub = encodeURIComponent(emailSubject[l.kind === "financing" ? "financing" : "contact"]);

            return (
              <div key={l.id} className={`rounded-xl border overflow-hidden ${!l.read ? "border-red-800/50 bg-red-950/10" : "border-neutral-800 bg-neutral-900/50"}`}>
                {/* Header */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                        {l.kind === "financing" ? <Briefcase className="w-5 h-5 text-red-500" /> : <MessageSquare className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {!l.read && <span className="px-2 py-0.5 text-[10px] bg-red-600 rounded uppercase font-bold">New</span>}
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                            {l.kind === "financing" ? "Financing Application" : "Contact Message"}
                          </span>
                          <span className="text-xs text-neutral-600">· {timeAgo(l.created_at)}</span>
                        </div>
                        <p className="font-display font-bold text-xl text-white mt-1">{name}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2 text-neutral-400">
                          {hasPhone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-red-500" /> {formatPhone(l.phone)}
                              <button onClick={() => copy(l.phone, `p${l.id}`)} title="Copy" className="text-neutral-600 hover:text-red-500">
                                {copied === `p${l.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </span>
                          )}
                          {l.email && (
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-red-500" /> {l.email}
                              <button onClick={() => copy(l.email, `e${l.id}`)} title="Copy" className="text-neutral-600 hover:text-red-500">
                                {copied === `e${l.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financing details */}
                  {l.kind === "financing" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 p-3 bg-neutral-950/60 rounded-lg border border-neutral-800">
                      {l.income && <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-red-500" /><span className="text-neutral-500">Income:</span> <span className="text-white font-medium">${l.income}/mo</span></div>}
                      {l.employment && <div className="flex items-center gap-2 text-sm"><Briefcase className="w-4 h-4 text-red-500" /><span className="text-neutral-500">Job:</span> <span className="text-white font-medium">{l.employment}</span></div>}
                      {l.down_payment && <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-red-500" /><span className="text-neutral-500">Down:</span> <span className="text-white font-medium">${l.down_payment}</span></div>}
                    </div>
                  )}

                  {/* Message */}
                  {(l.message || l.comment) && (
                    <div className="mt-4 p-4 bg-neutral-950/60 rounded-lg border border-neutral-800">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">Their message</p>
                      <p className="text-neutral-200 text-sm leading-relaxed">"{l.message || l.comment}"</p>
                    </div>
                  )}
                </div>

                {/* Reply actions */}
                <div className="border-t border-neutral-800 bg-neutral-950/40 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Quick Reply</p>
                  <div className="flex flex-wrap gap-2">
                    {hasPhone && (
                      <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                    )}
                    {hasPhone && (
                      <a href={`sms:${phone}?body=${smsMessage}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 hover:border-red-600 hover:bg-red-600/10 text-white text-sm font-semibold transition">
                        <MessageSquare className="w-4 h-4 text-red-500" /> Text (SMS)
                      </a>
                    )}
                    {hasPhone && (
                      <a href={`https://wa.me/1${phone}?text=${smsMessage}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 hover:border-green-500 hover:bg-green-500/10 text-white text-sm font-semibold transition">
                        <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                      </a>
                    )}
                    {l.email && (
                      <a href={`mailto:${l.email}?subject=${emailSub}&body=${emailMsg}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-700 hover:border-red-600 hover:bg-red-600/10 text-white text-sm font-semibold transition">
                        <Mail className="w-4 h-4 text-red-500" /> Email
                      </a>
                    )}
                    <div className="flex-1" />
                    {!l.read && (
                      <button onClick={() => markRead(l)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-red-500 hover:bg-neutral-900">
                        <Check className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                    <button onClick={() => del(l)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-red-500 hover:bg-neutral-900">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-3 leading-relaxed">
                    💡 Tap <span className="text-white font-semibold">Call</span> to phone them, <span className="text-white font-semibold">Text</span> to open SMS with a pre-filled reply, <span className="text-white font-semibold">WhatsApp</span> to message them, or <span className="text-white font-semibold">Email</span> to reply from your inbox.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
