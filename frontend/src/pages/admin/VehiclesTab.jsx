import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Tag, Car } from "lucide-react";
import { Button } from "../../components/ui/button";
import { VehiclesAPI } from "../../api";
import VehicleForm from "./VehicleForm";

const formatPrice = (p) => `$${new Intl.NumberFormat("en-US").format(p)}`;
const formatMiles = (m) => new Intl.NumberFormat("en-US").format(m);

export default function VehiclesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit

  const load = async () => {
    setLoading(true);
    try { setItems(await VehiclesAPI.list()); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onSave = async (data, id) => {
    if (id) await VehiclesAPI.update(id, data);
    else await VehiclesAPI.create(data);
    setEditing(null);
    await load();
  };

  const onDelete = async (v) => {
    if (!window.confirm(`Delete ${v.year} ${v.make} ${v.model}?`)) return;
    await VehiclesAPI.remove(v.id);
    await load();
  };

  const toggleSold = async (v) => {
    await VehiclesAPI.update(v.id, { ...v, sold: !v.sold });
    await load();
  };

  if (editing !== null) {
    return <VehicleForm initial={editing} onCancel={() => setEditing(null)} onSave={onSave} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-black text-3xl">Vehicles</h2>
          <p className="text-neutral-500 text-sm mt-1">{items.length} total · {items.filter(v => v.sold).length} sold</p>
        </div>
        <Button onClick={() => setEditing({})} className="bg-red-600 hover:bg-red-500 rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-800 rounded-xl">
          <Car className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">No vehicles yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((v) => (
            <div key={v.id} className={`flex items-center gap-4 p-4 rounded-xl border ${v.sold ? "border-red-800/50 bg-red-950/20" : "border-neutral-800 bg-neutral-900"}`}>
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                {v.photos?.[0] ? <img src={v.photos[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Car className="w-6 h-6 text-neutral-600" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white truncate">{v.year} {v.make} {v.model}</p>
                  {v.sold && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 rounded uppercase">SOLD</span>}
                </div>
                <p className="text-xs text-neutral-500">{v.trim} · {formatMiles(v.mileage)} mi</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-bold text-red-500">{formatPrice(v.price)}</p>
                <p className="text-xs text-neutral-600">{v.body}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleSold(v)} title={v.sold ? "Mark Available" : "Mark Sold"} className="w-9 h-9 rounded-lg border border-neutral-800 hover:border-red-600 flex items-center justify-center text-neutral-400 hover:text-red-500">
                  <Tag className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(v)} title="Edit" className="w-9 h-9 rounded-lg border border-neutral-800 hover:border-red-600 flex items-center justify-center text-neutral-400 hover:text-red-500">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(v)} title="Delete" className="w-9 h-9 rounded-lg border border-neutral-800 hover:border-red-600 flex items-center justify-center text-neutral-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
