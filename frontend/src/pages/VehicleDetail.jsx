import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Gauge, Fuel, Cog, Palette, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { inventory, dealerInfo } from "../mock";
import { useLang } from "../i18n";

const formatMiles = (m) => new Intl.NumberFormat("en-US").format(m);
const formatPrice = (p) => `$${new Intl.NumberFormat("en-US").format(p)}`;

export default function VehicleDetail() {
  const { t } = useLang();
  const { id } = useParams();
  const car = inventory.find((c) => String(c.id) === String(id));

  if (!car) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-neutral-950 text-white text-center px-6">
        <h1 className="font-display text-4xl font-black mb-4">{t.veh.notFound}</h1>
        <Link to="/inventory">
          <Button className="bg-red-600 hover:bg-red-500 text-neutral-950 rounded-full">{t.veh.backBtn}</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-24 min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/inventory" className="inline-flex items-center gap-2 text-neutral-400 hover:text-red-500 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> {t.veh.back}
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[4/3]">
              <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-neutral-800 aspect-[4/3] opacity-60 hover:opacity-100 transition cursor-pointer">
                  <img src={car.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">{car.body}</span>
            <h1 className="font-display font-black text-4xl md:text-5xl text-white mt-2 leading-tight">
              {car.year} {car.make}<br />{car.model}
            </h1>
            <p className="text-neutral-400 mt-2">{car.trim}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display font-black text-5xl text-red-500">{formatPrice(car.price)}</span>
              <span className="text-neutral-500 text-sm">{t.veh.orAsk}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { i: Gauge, l: t.veh.mileage, v: `${formatMiles(car.mileage)} mi` },
                { i: Cog, l: t.veh.transmission, v: car.transmission },
                { i: Fuel, l: t.veh.fuel, v: car.fuel },
                { i: Palette, l: t.veh.color, v: car.color },
              ].map((s) => (
                <div key={s.l} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="flex items-center gap-2 mb-1">
                    <s.i className="w-4 h-4 text-red-500" />
                    <span className="text-xs uppercase tracking-wider text-neutral-500">{s.l}</span>
                  </div>
                  <p className="text-white font-medium">{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-xl bg-neutral-900 border border-neutral-800">
              <h3 className="font-display font-bold text-white text-lg mb-3">{t.veh.features}</h3>
              <ul className="space-y-2">
                {car.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500" /> {f}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-sm text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-red-500" /> {t.veh.certified}
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/financing" className="flex-1">
                <Button className="w-full bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
                  {t.veh.apply}
                </Button>
              </Link>
              <a href={`tel:${dealerInfo.phoneRaw}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-red-500 h-12 rounded-xl">
                  <Phone className="w-4 h-4 mr-2" /> {t.veh.callDealer}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
