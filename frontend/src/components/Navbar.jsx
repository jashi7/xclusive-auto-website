import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, Globe } from "lucide-react";
import { dealerInfo } from "../mock";
import { Button } from "./ui/button";
import { useLang } from "../i18n";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/inventory", label: t.nav.inventory },
    { to: "/financing", label: t.nav.financing },
    { to: "/contact", label: t.nav.contact },
  ];

  const toggleLang = () => setLang(lang === "en" ? "es" : "en");

  const LangSwitch = () => (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 h-9 rounded-full border border-neutral-700 hover:border-red-600 hover:bg-red-600/10 text-white text-xs font-semibold uppercase tracking-wider transition-all"
      aria-label="Change language"
      title={lang === "en" ? "Cambiar a Español" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className={lang === "en" ? "text-red-500" : "text-neutral-500"}>EN</span>
      <span className="text-neutral-700">/</span>
      <span className={lang === "es" ? "text-red-500" : "text-neutral-500"}>ES</span>
    </button>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-blur ${scrolled ? "bg-neutral-950/85 border-b border-neutral-800/80 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={dealerInfo.logo} alt="Xclusive Auto LLC" className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold text-white text-lg tracking-tight">Xclusive Auto</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-red-600">{t.nav.tagline}</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link text-sm font-medium tracking-wide transition-colors ${isActive ? "text-red-500 active" : "text-neutral-200 hover:text-white"}`} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LangSwitch />
          <a href={`tel:${dealerInfo.phoneRaw}`} className="flex items-center gap-2 text-sm text-neutral-200 hover:text-red-500 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium">{dealerInfo.phone}</span>
          </a>
          <Link to="/inventory">
            <Button className="bg-red-600 hover:bg-red-500 text-white font-semibold rounded-full px-5 btn-glow">{t.nav.viewInventory}</Button>
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <LangSwitch />
          <button onClick={() => setOpen((o) => !o)} className="text-white p-2" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} bg-neutral-950/95 border-t border-neutral-800`}>
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-base font-medium ${isActive ? "text-red-500" : "text-neutral-200"}`} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
          <a href={`tel:${dealerInfo.phoneRaw}`} className="flex items-center gap-2 text-neutral-200">
            <Phone className="w-4 h-4 text-red-500" /> {dealerInfo.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
