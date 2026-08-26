import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { dealerInfo } from "../mock";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast({ title: "Missing info", description: "Please provide your name and message." });
      return;
    }
    toast({ title: "Message sent!", description: "Thanks for reaching out. We'll be in touch soon." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="pt-28 pb-24 min-h-screen bg-neutral-950">
      <div className="relative border-b border-neutral-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 70% 50%, rgba(220,38,38,0.15), transparent 60%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">Contact</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mt-2">Get In Touch</h1>
          <p className="text-sm text-neutral-500 italic mt-1">Contáctanos</p>
          <p className="text-neutral-400 mt-3 max-w-xl">Questions about a vehicle, financing, or trade-in? We’re here to help.</p>
          <p className="text-sm text-neutral-500 italic mt-1 max-w-xl">¿Preguntas sobre un vehículo, financiamiento o intercambio? Estamos para ayudarte.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { i: Phone, t: "Phone", v: dealerInfo.phone, href: `tel:${dealerInfo.phoneRaw}` },
            { i: Mail, t: "Email", v: dealerInfo.email, href: `mailto:${dealerInfo.email}` },
            { i: MapPin, t: "Address", v: `${dealerInfo.address}, ${dealerInfo.city}` },
          ].map((c) => (
            <a key={c.t} href={c.href || "#"} className="flex gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-red-600/50 transition group">
              <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                <c.i className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">{c.t}</p>
                <p className="text-white font-medium group-hover:text-red-500 transition">{c.v}</p>
              </div>
            </a>
          ))}

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-display font-bold text-white text-lg">Dealership Hours</h3>
              <span className="text-xs italic text-neutral-500 ml-auto">Horario</span>
            </div>
            <ul className="space-y-2 text-sm">
              {dealerInfo.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span className="text-neutral-400">{h.day}</span>
                  <span className={h.open ? "text-white font-medium" : "text-red-500"}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60">
            <h3 className="font-display font-bold text-white text-lg mb-4">Follow Us <span className="text-xs text-neutral-500 italic font-normal">· Síguenos</span></h3>
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
          <h2 className="font-display font-bold text-2xl text-white mb-1">Send Us A Message</h2>
          <p className="text-neutral-500 text-sm mb-1">We usually respond within an hour during business hours.</p>
          <p className="text-neutral-600 text-xs italic mb-6">Envíanos un mensaje · Respondemos dentro de una hora</p>
          <div className="space-y-4">
            <div>
              <Label className="text-neutral-300 text-xs uppercase tracking-wider">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-300 text-xs uppercase tracking-wider">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs uppercase tracking-wider">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
              </div>
            </div>
            <div>
              <Label className="text-neutral-300 text-xs uppercase tracking-wider">Message</Label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-neutral-950 border border-neutral-800 rounded-md text-white mt-1.5 p-3 focus:outline-none focus:border-red-600" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
              Send Message <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
