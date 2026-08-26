import { useEffect, useRef, useState } from "react";
import { X, Upload, Trash2, Save, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";

const BODIES = ["Sedan", "SUV", "Pickup Truck", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Minivan"];
const FUELS = ["Gasoline", "Diesel", "Hybrid", "Electric"];
const TRANS = ["Automatic", "Manual", "CVT"];
const MAKES = ["Acura","Audi","BMW","Buick","Cadillac","Chevrolet","Chrysler","Dodge","Ford","GMC","Honda","Hyundai","Infiniti","Jeep","Kia","Lexus","Lincoln","Mazda","Mercedes-Benz","Nissan","RAM","Subaru","Tesla","Toyota","Volkswagen","Volvo"];

// Resize an image file to max width 1200 and jpeg 0.82 quality, return data URI
async function resizeImage(file, maxW = 1200) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function VehicleForm({ initial, onCancel, onSave }) {
  const isNew = !initial?.id;
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    make: "Toyota",
    model: "",
    trim: "",
    body: "Sedan",
    mileage: 0,
    price: 0,
    color: "",
    fuel: "Gasoline",
    transmission: "Automatic",
    features: [],
    description: "",
    sold: false,
    photos: [],
    ...(initial || {}),
  });
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) || 0 }));

  const addPhotos = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const dataUri = await resizeImage(file);
        results.push(dataUri);
      }
      setForm((f) => ({ ...f, photos: [...(f.photos || []), ...results] }));
    } finally { setUploading(false); }
  };

  const removePhoto = (idx) => setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, features: [...f.features, v] }));
    setFeatureInput("");
  };
  const removeFeature = (idx) => setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.model) { alert("Model is required"); return; }
    setBusy(true);
    try {
      const payload = { ...form };
      // Strip metadata fields not in schema
      delete payload.id; delete payload.created_at; delete payload.updated_at;
      await onSave(payload, initial?.id);
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onCancel} className="flex items-center gap-2 text-neutral-400 hover:text-red-500 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>
        <h2 className="font-display font-black text-2xl">{isNew ? "New Vehicle" : "Edit Vehicle"}</h2>
        <Button type="submit" disabled={busy} className="bg-red-600 hover:bg-red-500 rounded-full">
          <Save className="w-4 h-4 mr-2" /> {busy ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Photos */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900">
        <Label className="text-white font-semibold">Photos ({form.photos?.length || 0})</Label>
        <p className="text-xs text-neutral-500 mb-4">Drag or upload. First photo is the main one. Auto-resized for fast loading.</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-red-600 transition"
        >
          <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">{uploading ? "Uploading..." : "Click or drag photos here"}</p>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
        </div>
        {form.photos?.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {form.photos.map((p, i) => (
              <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-neutral-800">
                <img src={p} alt="" className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute top-1 left-1 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase font-bold">Main</span>}
                <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-neutral-950/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900 grid md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs uppercase text-neutral-500">Year *</Label>
          <Input type="number" value={form.year} onChange={setNum("year")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" required />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Make *</Label>
          <Select value={form.make} onValueChange={(v) => setForm((f) => ({ ...f, make: v }))}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white max-h-72">
              {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Model *</Label>
          <Input value={form.model} onChange={set("model")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" required />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Trim</Label>
          <Input value={form.trim} onChange={set("trim")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" placeholder="e.g. LE" />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Body</Label>
          <Select value={form.body} onValueChange={(v) => setForm((f) => ({ ...f, body: v }))}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {BODIES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Color</Label>
          <Input value={form.color} onChange={set("color")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" placeholder="e.g. Silver" />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Mileage</Label>
          <Input type="number" value={form.mileage} onChange={setNum("mileage")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Price ($)</Label>
          <Input type="number" value={form.price} onChange={setNum("price")} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" />
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Transmission</Label>
          <Select value={form.transmission} onValueChange={(v) => setForm((f) => ({ ...f, transmission: v }))}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {TRANS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Fuel</Label>
          <Select value={form.fuel} onValueChange={(v) => setForm((f) => ({ ...f, fuel: v }))}>
            <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
              {FUELS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch checked={form.sold} onCheckedChange={(v) => setForm((f) => ({ ...f, sold: v }))} />
          <Label className="text-neutral-300">Mark as Sold</Label>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900">
        <Label className="text-white font-semibold">Features</Label>
        <div className="flex gap-2 mt-3">
          <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} placeholder="e.g. Sunroof" className="bg-neutral-950 border-neutral-800 text-white h-11" />
          <Button type="button" onClick={addFeature} className="bg-red-600 hover:bg-red-500">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {form.features.map((f, i) => (
            <span key={i} className="px-3 py-1 bg-neutral-800 rounded-full text-sm flex items-center gap-2">
              {f}
              <button type="button" onClick={() => removeFeature(i)} className="text-neutral-500 hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900">
        <Label className="text-white font-semibold">Description (optional)</Label>
        <textarea value={form.description} onChange={set("description")} rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-md text-white mt-3 p-3 focus:outline-none focus:border-red-600" placeholder="Anything special about this vehicle..." />
      </div>
    </form>
  );
}
