import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import VehicleCard from "../components/VehicleCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { inventory, makes, bodyStyles, priceRanges } from "../mock";
import { useLang } from "../i18n";

export default function Inventory() {
  const { t } = useLang();
  const [params] = useSearchParams();
  const [make, setMake] = useState(params.get("make") || "All Makes");
  const [body, setBody] = useState("All Body Styles");
  const [maxPrice, setMaxPrice] = useState(Number(params.get("max")) || 999999);
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState("price-asc");

  useEffect(() => {
    setMake(params.get("make") || "All Makes");
    setMaxPrice(Number(params.get("max")) || 999999);
    setQuery(params.get("q") || "");
  }, [params]);

  const filtered = useMemo(() => {
    let result = inventory.filter((c) => {
      if (make !== "All Makes" && c.make !== make) return false;
      if (body !== "All Body Styles" && c.body !== body) return false;
      if (c.price > maxPrice) return false;
      if (query) {
        const q = query.toLowerCase();
        const target = `${c.year} ${c.make} ${c.model} ${c.trim}`.toLowerCase();
        if (!target.includes(q)) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "year-desc": result.sort((a, b) => b.year - a.year); break;
      case "miles-asc": result.sort((a, b) => a.mileage - b.mileage); break;
      default: break;
    }
    return result;
  }, [make, body, maxPrice, query, sort]);

  return (
    <main className="pt-28 pb-24 min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-neutral-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/85 to-neutral-950" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">{t.inv.eyebrow}</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mt-2">{t.inv.title}</h1>
          <p className="text-neutral-400 mt-3 max-w-xl">{t.inv.desc}</p>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.inv.searchPh}
              className="bg-neutral-950 border-neutral-800 text-white h-11 pl-10 placeholder:text-neutral-600"
            />
          </div>
          <Select value={make} onValueChange={setMake}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {makes.map((m) => <SelectItem key={m} value={m}>{m === "All Makes" ? t.search.allMakes : m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={body} onValueChange={setBody}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {bodyStyles.map((b) => <SelectItem key={b} value={b}>{b === "All Body Styles" ? t.search.allBodies : b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(maxPrice)} onValueChange={(v) => setMaxPrice(Number(v))}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {priceRanges.map((p) => <SelectItem key={p.value} value={String(p.value)}>{p.label === "No Max Price" ? t.search.noMax : p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-neutral-400 text-sm">
            <span className="text-red-500 font-bold">{filtered.length}</span> {filtered.length === 1 ? t.inv.found : t.inv.foundPlural}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white h-10 w-48"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                <SelectItem value="price-asc">{t.inv.sortPriceAsc}</SelectItem>
                <SelectItem value="price-desc">{t.inv.sortPriceDesc}</SelectItem>
                <SelectItem value="year-desc">{t.inv.sortYear}</SelectItem>
                <SelectItem value="miles-asc">{t.inv.sortMiles}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-400">{t.inv.noMatch}</p>
            <Button className="mt-6 bg-red-600 hover:bg-red-500 text-neutral-950" onClick={() => {
              setMake("All Makes"); setBody("All Body Styles"); setMaxPrice(999999); setQuery("");
            }}>{t.inv.reset}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => <VehicleCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </main>
  );
}
