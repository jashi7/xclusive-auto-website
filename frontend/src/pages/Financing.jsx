import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { dealerInfo } from "../mock";

export default function Financing() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    income: "", employment: "Full-time", downPayment: "", comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) {
      toast({ title: "Missing info", description: "Please fill first name, last name & phone." });
      return;
    }
    setSubmitted(true);
    toast({ title: "Application received!", description: "We'll call you shortly. Thanks!" });
  };

  return (
    <main className="pt-28 pb-24 bg-neutral-950 min-h-screen">
      <div className="relative overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 20% 30%, rgba(245,158,11,0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(217,119,6,0.12), transparent 50%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <span className="text-amber-500 text-xs uppercase tracking-[0.3em] font-semibold">Financing</span>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mt-2">Buy Here · Pay Here</h1>
          <p className="text-neutral-400 mt-3 max-w-xl">No credit check needed. Verified income and four personal references — you’re approved.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {[
            { i: ShieldCheck, t: "No Credit Check", d: "Good, bad, or no credit — everyone is welcome to apply." },
            { i: FileText, t: "Simple Paperwork", d: "Verified income & 4 personal references is all we need." },
            { i: CreditCard, t: "Flexible Payments", d: "Weekly or bi-weekly plans that fit your budget." },
          ].map((f) => (
            <div key={f.t} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <f.i className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-white text-xl">{f.t}</h3>
              <p className="text-neutral-400 text-sm mt-1">{f.d}</p>
            </div>
          ))}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950">
            <h3 className="font-display font-bold text-xl mb-2">Prefer to talk?</h3>
            <p className="text-sm opacity-90 mb-4">Give us a call — we’ll walk you through the approval process in minutes.</p>
            <a href={`tel:${dealerInfo.phoneRaw}`}>
              <Button className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-semibold">
                Call {dealerInfo.phone}
              </Button>
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="font-display font-black text-3xl text-white mb-3">Application Received!</h2>
              <p className="text-neutral-400 mb-8">Thanks {form.firstName}! Our team will contact you at {form.phone} shortly.</p>
              <Link to="/inventory">
                <Button className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-full px-6">
                  Browse Inventory <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-1">Quick Application</h2>
              <p className="text-neutral-500 text-sm mb-6">Takes less than 2 minutes.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">First Name</Label>
                  <Input value={form.firstName} onChange={handle("firstName")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Last Name</Label>
                  <Input value={form.lastName} onChange={handle("lastName")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Email</Label>
                  <Input type="email" value={form.email} onChange={handle("email")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Phone</Label>
                  <Input value={form.phone} onChange={handle("phone")} className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Monthly Income</Label>
                  <Input value={form.income} onChange={handle("income")} placeholder="$" className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Employment</Label>
                  <Select value={form.employment} onValueChange={(v) => setForm((f) => ({ ...f, employment: v }))}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Down Payment Available</Label>
                  <Input value={form.downPayment} onChange={handle("downPayment")} placeholder="$" className="bg-neutral-950 border-neutral-800 text-white mt-1.5 h-11" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-neutral-300 text-xs uppercase tracking-wider">Comment</Label>
                  <textarea value={form.comment} onChange={handle("comment")} rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-md text-white mt-1.5 p-3 focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold h-12 rounded-xl btn-glow">
                Submit Application <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-neutral-500 mt-4 text-center">By submitting, you agree to be contacted by Xclusive Auto LLC.</p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
