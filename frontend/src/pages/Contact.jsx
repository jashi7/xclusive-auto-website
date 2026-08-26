import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { dealerInfo } from "../mock";
import { LeadsAPI } from "../api";
import { useLang } from "../i18n";

export default function Contact() {
  const { t } = useLang();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast({ title: t.contact.missingTitle, description: t.contact.missingDesc });
      return;
    }
    try {
      await LeadsAPI.create({ kind: "contact", name: form.name, email: form.email, phone: form.phone, message: form.message });
      toast({ title: t.contact.sentTitle, description: t.contact.sentDesc });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Please try again." });
    }
  };

  return (
    <main className="pt-28 pb-24 min-h-screen bg-neutral-950">
      <div className="relative border-b border-neutral-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 70% 50%, rgba(220,38,38,0.15), transparent 60%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">{t.contact.eyebrow}</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mt-2">{t.contact.title}</h1>
          
          <p className="text-neutral-400 mt-3 max-w-xl">{t.contact.desc}</p>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {(() => {
            const addr = encodeURIComponent(`${dealerInfo.address}, ${dealerInfo.city}`);
            const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
            const appleUrl = `https://maps.apple.com/?daddr=${addr}`;
            const cards = [
              { i: Phone, t: t.contact.phone, v: dealerInfo.phone, href: `tel:${dealerInfo.phoneRaw}` },
              { i: Mail, t: t.contact.email, v: dealerInfo.email, href: `mailto:${dealerInfo.email}` },
              { i: MapPin, t: t.contact.address, v: `${dealerInfo.address}, ${dealerInfo.city}`, href: googleUrl, isAddress: true, appleUrl, googleUrl },
            ];
            return cards.map((c) => (
              <a key={c.t} href={c.href || "#"} target={c.isAddress ? "_blank" : undefined} rel={c.isAddress ? "noopener noreferrer" : undefined} className="flex gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-red-600/50 transition group">
                <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                  <c.i className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-neutral-500">{c.t}</p>
                  <p className="text-white font-medium group-hover:text-red-500 transition">{c.v}</p>
                  {c.isAddress && (
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <a href={c.googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-700 hover:border-red-600 hover:bg-red-600/10 text-xs font-medium text-neutral-200 transition">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                        Google Maps
                      </a>
                      <a href={c.appleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-700 hover:border-red-600 hover:bg-red-600/10 text-xs font-medium text-neutral-200 transition">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                        Apple Maps
                      </a>
                    </div>
                  )}
                </div>
              </a>
            ));
          })()}

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-display font-bold text-white text-lg">{t.contact.hours}</h3>
              
            </div>
            <ul className="space-y-2 text-sm">
              {dealerInfo.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span className="text-neutral-400">{t.days[h.day] || h.day}</span>
                  <span className={h.open ? "text-white font-medium" : "text-red-500"}>{h.open ? h.time : t.days.Closed}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
            <h3 className="font-display font-bold text-white text-lg mb-4">{t.contact.followUs}</h3>
            <div className="grid grid-cols-3 gap-3">
              <a href="https://www.instagram.com/xclusive.auto/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-800 hover:border-red-600 hover:bg-red-600/10 transition group">
                <Instagram className="w-6 h-6 text-neutral-300 group-hover:text-red-500" />
                <span className="text-xs text-neutral-400 group-hover:text-white">Instagram</span>
              </a>
              <a href="https://www.facebook.com/xclusiveautollc" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-800 hover:border-red-600 hover:bg-red-600/10 transition group">
                <Facebook className="w-6 h-6 text-neutral-300 group-hover:text-red-500" />
                <span className="text-xs text-neutral-400 group-hover:text-white">Facebook</span>
              </a>
              <a href={`https://wa.me/1${dealerInfo.phoneRaw}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-800 hover:border-green-500 hover:bg-green-500/10 transition group">
                <MessageCircle className="w-6 h-6 text-neutral-300 group-hover:text-green-400" />
                <span className="text-xs text-neutral-400 group-hover:text-white">WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-neutral-800 aspect-video">
            <iframe
              title="Xclusive Auto Location"
              src="https://www.google.com/maps?q=7501+Old+Telegraph+Rd,+Hanover,+MD+21076&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="grayscale contrast-125"
              style={{ border: 0 }}
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-fit">
          <h2 className="font-display font-bold text-2xl text-white mb-1">{t.contact.sendMsg}</h2>
          <p className="text-neutral-500 text-sm mb-1">{t.contact.respond}</p>
          
          <div className="space-y-4">
            <div>
              <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.contact.name}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.email}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.phone}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
              </div>
            </div>
            <div>
              <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.contact.messageL}</Label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-neutral-950 border border-neutral-800 rounded-md text-white mt-1.5 p-3 focus:outline-none focus:border-red-600" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
              {t.contact.sendBtn} <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
