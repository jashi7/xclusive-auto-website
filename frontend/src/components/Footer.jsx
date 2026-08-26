import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { dealerInfo } from "../mock";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <img src={dealerInfo.logo} alt="Xclusive Auto" className="h-14 mb-4" />
          <p className="text-sm text-neutral-400 leading-relaxed">
            Quality used vehicles and no credit check financing in Hanover, MD.
            Drive off the lot with confidence.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:border-red-600 hover:text-red-500 transition-colors"
                aria-label="social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
            <li><Link to="/inventory" className="hover:text-red-500 transition-colors">Inventory</Link></li>
            <li><Link to="/financing" className="hover:text-red-500 transition-colors">Financing</Link></li>
            <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">Visit Us</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><span>{dealerInfo.address}<br />{dealerInfo.city}</span></li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><a href={`tel:${dealerInfo.phoneRaw}`} className="hover:text-red-500">{dealerInfo.phone}</a></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" /><a href={`mailto:${dealerInfo.email}`} className="hover:text-red-500">{dealerInfo.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4 uppercase text-xs tracking-widest">Hours <span className="text-neutral-500 normal-case italic tracking-normal">· Horario</span></h4>
          <ul className="space-y-2 text-sm">
            {dealerInfo.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span className="text-neutral-500">{h.day}</span>
                <span className={h.open ? "text-neutral-200" : "text-red-500"}>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-900 py-6 px-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Xclusive Auto LLC. All rights reserved.
      </div>
    </footer>
  );
}
