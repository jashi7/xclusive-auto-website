import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import { dealerInfo } from "../mock";
import { useLang } from "../i18n";

export default function Footer() {
  const { t, lang } = useLang();
  const socials = [
    { Icon: Instagram, href: "https://www.instagram.com/xclusive.auto/", label: "Instagram" },
    { Icon: Facebook, href: "https://www.facebook.com/xclusiveautollc", label: "Facebook" },
    { Icon: MessageCircle, href: `https://wa.me/1${dealerInfo.phoneRaw}`, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <img src={dealerInfo.logo} alt="Xclusive Auto" className="h-14 mb-4" />
          <p className="text-sm text-neutral-400 leading-relaxed">
            {t.footer.desc}
          </p>
          <div className="flex gap-3 mt-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:border-red-600 hover:text-red-500 hover:bg-red-600/10 transition-all"
                aria-label={s.label}
                title={s.label}
              >
                <s.Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">{t.footer.explore}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-red-500 transition-colors">{t.nav.home}</Link></li>
            <li><Link to="/inventory" className="hover:text-red-500 transition-colors">{t.nav.inventory}</Link></li>
            <li><Link to="/financing" className="hover:text-red-500 transition-colors">{t.nav.financing}</Link></li>
            <li><Link to="/contact" className="hover:text-red-500 transition-colors">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">{t.footer.visit}</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><span>{dealerInfo.address}<br />{dealerInfo.city}</span></li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><a href={`tel:${dealerInfo.phoneRaw}`} className="hover:text-red-500">{dealerInfo.phone}</a></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><a href={`mailto:${dealerInfo.email}`} className="hover:text-red-500">{dealerInfo.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">{t.footer.hours}</h4>
          <ul className="space-y-2 text-sm">
            {dealerInfo.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span className="text-neutral-500">{t.days[h.day] || h.day}</span>
                <span className={h.open ? "text-neutral-200" : "text-red-500"}>{h.open ? h.time : t.days.Closed}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-900 py-6 px-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Xclusive Auto LLC. {t.footer.rights}
      </div>
    </footer>
  );
}
