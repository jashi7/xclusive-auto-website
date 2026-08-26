import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Car, MessageSquare, Settings as SettingsIcon, LogOut, Home as HomeIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { dealerInfo } from "../../mock";
import VehiclesTab from "./VehiclesTab";
import LeadsTab from "./LeadsTab";
import SettingsTab from "./SettingsTab";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState("vehicles");

  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;

  const tabs = [
    { key: "vehicles", label: "Vehicles", icon: Car },
    { key: "leads", label: "Leads", icon: MessageSquare },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={dealerInfo.logo} alt="Xclusive Auto" className="h-9" />
            <div>
              <p className="font-display font-bold text-sm leading-none">Admin Dashboard</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Xclusive Auto</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1.5"><HomeIcon className="w-4 h-4" /> View Site</Link>
            <button onClick={logout} className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1.5"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <nav className="space-y-1 sticky top-24">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${tab === t.key ? "bg-red-600 text-white" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          {tab === "vehicles" && <VehiclesTab />}
          {tab === "leads" && <LeadsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
