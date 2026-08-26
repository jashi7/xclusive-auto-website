import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { dealerInfo } from "../mock";
import { LeadsAPI } from "../api";
import { useLang } from "../i18n";

export default function Financing() {
  const { t } = useLang();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    income: "", employment: "Full-time", downPayment: "", comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) {
      toast({ title: t.fin.missingTitle, description: t.fin.missingDesc });
      return;
    }
    try {
      await LeadsAPI.create({
        kind: "financing",
        first_name: form.firstName, last_name: form.lastName,
        email: form.email, phone: form.phone,
        income: form.income, employment: form.employment,
        down_payment: form.downPayment, comment: form.comment,
      });
      setSubmitted(true);
      toast({ title: t.fin.appReceivedToast, description: t.fin.appReceivedDesc });
    } catch {
      toast({ title: "Error", description: "Please try again." });
    }
  };

  return (
    <main className="pt-28 pb-24 bg-neutral-950 min-h-screen">
      <div className="relative overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 20% 30%, rgba(220,38,38,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(185,28,28,0.12), transparent 50%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <span className="text-red-600 text-xs uppercase tracking-[0.3em] font-semibold">{t.fin.eyebrow}</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mt-2">{t.fin.title}</h1>
          
          <p className="text-neutral-400 mt-3 max-w-xl">{t.fin.desc}</p>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {[
            { i: ShieldCheck, t: t.fin.f1t, d: t.fin.f1d },
            { i: FileText, t: t.fin.f2t, d: t.fin.f2d },
            { i: CreditCard, t: t.fin.f3t, d: t.fin.f3d },
          ].map((f) => (
            <div key={f.t} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-red-600/40 transition">
              <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-4">
                <f.i className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-display font-bold text-white text-xl">{f.t}</h3>
              <p className="text-neutral-400 text-sm mt-1">{f.d}</p>
            </div>
          ))}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-neutral-950">
            <h3 className="font-display font-bold text-xl mb-1">{t.fin.preferTitle}</h3>
            
            <p className="text-sm opacity-90 mb-4">{t.fin.preferDesc}</p>
            <a href={`tel:${dealerInfo.phoneRaw}`}>
              <Button className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-semibold">
                {t.fin.callBtn} {dealerInfo.phone}
              </Button>
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-neutral-900 border border-red-600/40 rounded-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="font-display font-black text-3xl text-white mb-3">{t.fin.receivedTitle}</h2>
              <p className="text-neutral-400 mb-8">{t.fin.receivedMsg.replace("{name}", form.firstName).replace("{phone}", form.phone)}</p>
              <Link to="/inventory">
                <Button className="bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold rounded-full px-6">
                  {t.fin.browseInv} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-1">{t.fin.quickApp}</h2>
              <p className="text-neutral-500 text-sm mb-1">{t.fin.takesMin}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.firstName}</Label>
                  <Input value={form.firstName} onChange={handle("firstName")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.lastName}</Label>
                  <Input value={form.lastName} onChange={handle("lastName")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.email}</Label>
                  <Input type="email" value={form.email} onChange={handle("email")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.phone}</Label>
                  <Input value={form.phone} onChange={handle("phone")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.income}</Label>
                  <Input value={form.income} onChange={handle("income")} placeholder="$" className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.employment}</Label>
                  <Select value={form.employment} onValueChange={(v) => setForm((f) => ({ ...f, employment: v }))}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                      <SelectItem value="Full-time">{t.fin.empFull}</SelectItem>
                      <SelectItem value="Part-time">{t.fin.empPart}</SelectItem>
                      <SelectItem value="Self-employed">{t.fin.empSelf}</SelectItem>
                      <SelectItem value="Other">{t.fin.empOther}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.down}</Label>
                  <Input value={form.downPayment} onChange={handle("downPayment")} placeholder="$" className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">{t.fin.comment}</Label>
                  <textarea value={form.comment} onChange={handle("comment")} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-md text-white mt-1.5 p-3 focus:outline-none focus:border-red-600" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6 bg-red-600 hover:bg-red-500 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
                {t.fin.submit} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-neutral-500 mt-4 text-center">{t.fin.disclaimer}</p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
