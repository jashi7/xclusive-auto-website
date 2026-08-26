import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Financing from "./pages/Financing";
import Contact from "./pages/Contact";
import VehicleDetail from "./pages/VehicleDetail";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppFab from "./components/WhatsAppFab";
import { LanguageProvider } from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

function PublicChrome({ children }) {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/admin");
  if (hideChrome) return <>{children}</>;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFab />
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = "Xclusive Auto LLC – Premium Used Cars in Hanover, MD";
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App bg-neutral-950 min-h-screen text-white">
          <BrowserRouter>
            <ScrollToTop />
            <PublicChrome>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/financing" element={<Financing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/vehicle/:id" element={<VehicleDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </PublicChrome>
            <Toaster />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
