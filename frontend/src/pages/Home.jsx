import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, CreditCard, Wrench, Star, ChevronRight, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import VehicleCard from "../components/VehicleCard";
import { dealerInfo, inventory, makes, priceRanges, testimonials } from "../mock";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function Home() {
  const [make, setMake] = useState("All Makes");
  const [maxPrice, setMaxPrice] = useState(999999);
  const [query, setQuery] = useState("");

  const featured = inventory.slice(0, 6);

  const [aboutRef, aboutVisible] = useReveal();
  const [testiRef, testiVisible] = useReveal();

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden section-dark">
        <div
          className="absolute inset-0 hero-bg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/80 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-600/40 bg-red-600/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest text-red-400 font-medium">Buy Here · Pay Here · No Credit Check</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2 italic">Compra Aquí · Paga Aquí · Sin Chequeo de Crédito</p>
            <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] text-white mb-6">
              Drive The Car <br />
              <span className="gradient-text">You Deserve.</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-xl mb-2 leading-relaxed">
              Hand-picked, certified pre-owned vehicles at honest prices in Hanover, MD. Easy financing for every credit story.
            </p>
            <p className="text-sm text-neutral-500 italic mb-8">
              Vehículos usados certificados a precios honestos en Hanover, MD. Financiamiento fácil para todos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/inventory">
                <Button size="lg" className="bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold rounded-full px-7 h-12 btn-glow">
                  Browse Inventory <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/financing">
                <Button size="lg" variant="outline" className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-red-500 rounded-full px-7 h-12">
                  Get Pre-Approved
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-neutral-800/60">
              {[
                { n: "500+", l: "Happy Drivers" },
                { n: "12+", l: "Vehicles In Stock" },
                { n: "0", l: "Credit Check Needed" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold text-red-500">{s.n}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search widget */}
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
              <h3 className="font-display font-bold text-2xl text-white mb-1">Find Your Vehicle</h3>
              <p className="text-sm text-neutral-400 mb-1">Search our current inventory</p>
              <p className="text-xs text-neutral-500 italic mb-6">Encuentra tu vehículo · Busca nuestro inventario</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1.5 block">Make</label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                      {makes.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1.5 block">Max Price</label>
                  <Select value={String(maxPrice)} onValueChange={(v) => setMaxPrice(Number(v))}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                      {priceRanges.map((p) => (
                        <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1.5 block">Keyword</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. Tacoma"
                      className="bg-neutral-950 border-neutral-800 text-white h-11 pl-10 placeholder:text-neutral-600"
                    />
                  </div>
                </div>
                <Link
                  to={`/inventory?make=${encodeURIComponent(make)}&max=${maxPrice}&q=${encodeURIComponent(query)}`}
                  className="block"
                >
                  <Button className="w-full bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
                    Search Vehicles <Search className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE brand strip */}
      <div className="section-mid py-6 border-y border-neutral-900 overflow-hidden">
        <div className="marquee gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, r) => (
            <div key={r} className="flex gap-16 shrink-0">
              {["TOYOTA", "HONDA", "CHEVROLET", "DODGE", "NISSAN", "FORD", "GMC", "SATURN"].map((b) => (
                <span key={b + r} className="font-display text-3xl font-black text-neutral-800 tracking-widest">
                  {b}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED INVENTORY */}
      <section className="relative section-mid py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">Featured</span>
              <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">Fresh Off The Lot</h2>
              <p className="text-sm text-neutral-500 italic mt-1">Recién llegados al lote</p>
            </div>
            <Link to="/inventory" className="text-red-500 hover:text-red-400 font-medium flex items-center gap-1 group">
              View All Vehicles <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative section-warm py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">Why Xclusive</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2 mb-2">
              A Better Way To <span className="gradient-text">Buy A Car</span>
            </h2>
            <p className="text-sm text-neutral-500 italic mb-6">Una mejor manera de comprar un auto</p>
            <p className="text-neutral-400 leading-relaxed mb-8">
              We’ve been serving the Hanover community with reliable, hand-inspected vehicles and honest financing. No pressure. No games. Just great cars.
            </p>
            <div className="space-y-5">
              {[
                { i: ShieldCheck, t: "Certified Inspected", d: "Every vehicle is inspected & repaired by a certified mechanic before sale." },
                { i: CreditCard, t: "No Credit Check Financing", d: "Verified income & 4 references — that’s all it takes. Easy in-house financing." },
                { i: Wrench, t: "Trade-Ins Welcome", d: "Get top value for your trade. We’ll make it simple and fair." },
              ].map((f) => (
                <div key={f.t} className="flex gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-red-600/50 hover:bg-neutral-900 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600/20">
                    <f.i className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-lg">{f.t}</h4>
                    <p className="text-sm text-neutral-400 mt-1">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={aboutRef} className={`section-fade ${aboutVisible ? "visible" : ""}`}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80"
                alt="Premium showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-neutral-950" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Call us today</p>
                      <a href={`tel:${dealerInfo.phoneRaw}`} className="font-display font-bold text-white text-xl hover:text-red-500">
                        {dealerInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testiRef} className={`section-dark py-24 section-fade ${testiVisible ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">Reviews</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2">Trusted By Drivers</h2>
            <p className="text-sm text-neutral-500 italic mt-1">De confianza para nuestros clientes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-600/50 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                </div>
                <p className="text-neutral-300 leading-relaxed mb-6">“{t.text}”</p>
                <div className="border-t border-neutral-800 pt-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-red-500 mt-0.5">{t.car}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display font-black text-3xl md:text-4xl text-neutral-950 leading-tight">
              Ready to drive off the lot today?
            </h2>
            <p className="text-neutral-900/90 italic text-sm mt-1">¿Listo para llevarte tu auto hoy?</p>
            <p className="text-neutral-900/80 mt-2">Come visit our lot in Hanover — or start online in 60 seconds.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/financing">
              <Button size="lg" className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-7 h-12 font-semibold">
                Apply For Financing
              </Button>
            </Link>
            <a href={`tel:${dealerInfo.phoneRaw}`}>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-neutral-900 text-neutral-950 hover:bg-white/20 hover:text-neutral-950 rounded-full px-7 h-12 font-semibold">
                <Phone className="w-4 h-4 mr-2" /> {dealerInfo.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="section-mid py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">Visit Us</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mt-2 mb-2">Come Say Hello</h2>
            <p className="text-sm text-neutral-500 italic mb-6">Ven a saludarnos</p>
            <div className="flex items-start gap-3 mb-4 text-neutral-300">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
              <span>{dealerInfo.address}, {dealerInfo.city}</span>
            </div>
            <div className="flex items-start gap-3 mb-8 text-neutral-300">
              <Phone className="w-5 h-5 text-red-500 mt-0.5" />
              <a href={`tel:${dealerInfo.phoneRaw}`} className="hover:text-red-500">{dealerInfo.phone}</a>
            </div>
            <Link to="/contact">
              <Button className="bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold rounded-full px-6">
                Get Directions <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden border border-neutral-800 aspect-video">
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
      </section>
    </main>
  );
}
