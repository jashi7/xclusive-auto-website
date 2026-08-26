import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { SettingsAPI } from "../../api";

export default function SettingsTab() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    SettingsAPI.get().then(setData).catch(() => setData({}));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      const updated = await SettingsAPI.update({ notification_email: data.notification_email });
      setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  if (!data) return <p className="text-neutral-500">Loading...</p>;

  return (
    <div>
      <h2 className="font-display font-black text-3xl mb-6">Settings</h2>
      <form onSubmit={save} className="max-w-xl p-6 rounded-xl border border-neutral-800 bg-neutral-900 space-y-5">
        <div>
          <Label className="text-xs uppercase text-neutral-500">Admin Email (login)</Label>
          <Input value={data.email || ""} disabled className="bg-neutral-950 border-neutral-800 text-neutral-500 mt-1 h-11" />
          <p className="text-xs text-neutral-600 mt-1">Contact us to change your login email.</p>
        </div>
        <div>
          <Label className="text-xs uppercase text-neutral-500">Notification Email</Label>
          <Input value={data.notification_email || ""} onChange={(e) => setData({ ...data, notification_email: e.target.value })} className="bg-neutral-950 border-neutral-800 text-white mt-1 h-11" />
          <p className="text-xs text-neutral-600 mt-1">New leads will be emailed here once email delivery is wired up.</p>
        </div>
        <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-500 rounded-full">
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
