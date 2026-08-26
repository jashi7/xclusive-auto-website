import { Link } from "react-router-dom";
import { Gauge, Fuel, Cog, Palette } from "lucide-react";

const formatMiles = (m) => new Intl.NumberFormat("en-US").format(m);
const formatPrice = (p) => `$${new Intl.NumberFormat("en-US").format(p)}`;

export default function VehicleCard({ car }) {
  return (
    <Link to={`/vehicle/${car.id}`}>
      <div className="vehicle-card group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[4/3] bg-neutral-800">
          <img
            src={car.image}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-xs font-bold px-3 py-1 rounded-full">
            {car.year}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">View Details →</span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              {car.make} {car.model}
            </h3>
            <span className="text-amber-400 font-bold text-lg whitespace-nowrap">{formatPrice(car.price)}</span>
          </div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">{car.trim}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 mt-auto">
            <div className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-amber-500" /> {formatMiles(car.mileage)} mi</div>
            <div className="flex items-center gap-1.5"><Cog className="w-3.5 h-3.5 text-amber-500" /> {car.transmission}</div>
            <div className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-amber-500" /> {car.fuel}</div>
            <div className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-amber-500" /> {car.color}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
