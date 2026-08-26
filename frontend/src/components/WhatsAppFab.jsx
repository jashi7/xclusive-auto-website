import { useEffect, useState } from "react";
import { dealerInfo } from "../mock";
import { useLang } from "../i18n";

// Official WhatsApp glyph
function WhatsAppIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.53.53-.988 1.246-.988 2.05 0 .93.36 1.833.688 2.535 1.4 3.036 3.638 5.446 6.876 6.585.542.19 1.418.475 2.033.475.874 0 2.302-.472 2.633-1.362.13-.353.13-.658.086-.716-.052-.06-.202-.1-.398-.195-.196-.1-1.147-.573-1.32-.646-.174-.06-.334-.086-.482-.086zM16.02 3C8.905 3 3.135 8.77 3.135 15.885a12.85 12.85 0 0 0 2.235 7.246L3.03 30l6.99-2.29a12.87 12.87 0 0 0 6 1.49h.006c7.11 0 12.88-5.77 12.88-12.886 0-3.44-1.34-6.68-3.77-9.115A12.786 12.786 0 0 0 16.02 3zm0 23.788h-.005a10.86 10.86 0 0 1-5.53-1.513l-.395-.234-4.14 1.36 1.35-4.033-.257-.416a10.86 10.86 0 0 1-1.66-5.767c0-6.005 4.885-10.887 10.888-10.887a10.86 10.86 0 0 1 7.7 3.19 10.86 10.86 0 0 1 3.18 7.695c0 6.005-4.885 10.887-10.887 10.887z" />
    </svg>
  );
}

export default function WhatsAppFab() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  const href = `https://wa.me/1${dealerInfo.phoneRaw}?text=${encodeURIComponent(
    t.wa.greeting
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-3 pr-5 py-3 rounded-full text-white shadow-2xl transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ background: "#25D366", boxShadow: "0 12px 30px -6px rgba(37,211,102,0.5)" }}
    >
      <span className="relative flex">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping" />
        <WhatsAppIcon className="w-7 h-7 relative" />
      </span>
      <span className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-semibold">{t.wa.chat}</span>
        <span className="text-[10px] opacity-90">{t.wa.label}</span>
      </span>
    </a>
  );
}
