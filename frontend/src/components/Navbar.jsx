import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { dealerInfo } from "../mock";
import { Button } from "./ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/inventory", label: "Inventory" },
    { to: "/financing", label: "Financing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-blur ${
        scrolled
          ? "bg-neutral-950/85 border-b border-neutral-800/80 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={dealerInfo.logo}
            alt="Xclusive Auto LLC"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold text-white text-lg tracking-tight">Xclusive Auto</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500">Hanover, MD</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-amber-400 active" : "text-neutral-200 hover:text-white"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${dealerInfo.phoneRaw}`}
            className="flex items-center gap-2 text-sm text-neutral-200 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">{dealerInfo.phone}</span>
          </a>
          <Link to="/inventory">
            <Button className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-full px-5 btn-glow">
              View Inventory
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-white p-2"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-neutral-950/95 border-t border-neutral-800`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-base font-medium ${isActive ? "text-amber-400" : "text-neutral-200"}`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={`tel:${dealerInfo.phoneRaw}`}
            className="flex items-center gap-2 text-neutral-200"
          >
            <Phone className="w-4 h-4 text-amber-400" /> {dealerInfo.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
