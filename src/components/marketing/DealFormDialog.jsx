import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploadField from "@/components/marketing/ImageUploadField";

const categories = ["Food", "Grocery", "Fashion", "Beauty", "Tech", "Mobile", "Home", "Events", "Music", "Travel", "Services", "Apps", "Other"];

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const empty = {
  title: "", slug: "", brand_name: "", category: "Other", short_description: "", full_description: "",
  image_url: "", mobile_image_url: "", original_price: "", deal_price: "", discount_label: "",
  cta_text: "", cta_url: "", location: "", province: "",
  valid_from: "", valid_until: "", is_active: true, is_featured: false, is_sponsored: false,
  priority: 0, source_name: "", source_url: "", terms: "",
};

const toDateInput = (iso) => (iso ? String(iso).slice(0, 10) : "");
const toIso = (d) => (d ? new Date(d).toISOString() : null);
const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

export default function DealFormDialog({ open, onOpenChange, deal, onSubmit, isLoading }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (deal) {
      setForm({
        ...empty, ...deal,
        original_price: deal.original_price ?? "",
        deal_price: deal.deal_price ?? "",
        valid_from: toDateInput(deal.valid_from),
        valid_until: toDateInput(deal.valid_until),
        priority: deal.priority ?? 0,
        is_active: deal.is_active ?? true,
        is_featured: deal.is_featured ?? false,
        is_sponsored: deal.is_sponsored ?? false,
      });
    } else setForm(empty);
  }, [deal, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      slug: form.slug?.trim() || slugify(form.title),
      original_price: num(form.original_price),
      deal_price: num(form.deal_price),
      priority: Number(form.priority) || 0,
      valid_from: toIso(form.valid_from),
      valid_until: toIso(form.valid_until),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{deal ? "Edit Deal" : "New Deal"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Brand / store</Label><Input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Slug <span className="text-muted-foreground">(auto)</span></Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" /></div>
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="col-span-2 space-y-1.5"><Label>Short description</Label><Textarea rows={2} value={form.short_description} onChange={(e) => set("short_description", e.target.value)} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Full description</Label><Textarea rows={3} value={form.full_description} onChange={(e) => set("full_description", e.target.value)} /></div>
            <div className="col-span-2"><ImageUploadField label="Image" recommended="1200×800 or 1080×1080" category="deal" value={form.image_url} onChange={(url) => set("image_url", url)} /></div>
            <div className="col-span-2"><ImageUploadField label="Mobile image" recommended="optional" category="deal" value={form.mobile_image_url} onChange={(url) => set("mobile_image_url", url)} /></div>
            <div className="space-y-1.5"><Label>Original price (R)</Label><Input type="number" step="0.01" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Deal price (R)</Label><Input type="number" step="0.01" value={form.deal_price} onChange={(e) => set("deal_price", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Discount label</Label><Input value={form.discount_label} onChange={(e) => set("discount_label", e.target.value)} placeholder="Save 30%" /></div>
            <div className="space-y-1.5"><Label>Priority <span className="text-muted-foreground">(lower first)</span></Label><Input type="number" value={form.priority} onChange={(e) => set("priority", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>CTA text</Label><Input value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} placeholder="View deal" /></div>
            <div className="space-y-1.5"><Label>CTA URL</Label><Input value={form.cta_url} onChange={(e) => set("cta_url", e.target.value)} placeholder="https://…" /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Province</Label><Input value={form.province} onChange={(e) => set("province", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Valid from</Label><Input type="date" value={form.valid_from} onChange={(e) => set("valid_from", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Valid until</Label><Input type="date" value={form.valid_until} onChange={(e) => set("valid_until", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Source name <span className="text-muted-foreground">(attribution)</span></Label><Input value={form.source_name} onChange={(e) => set("source_name", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Source URL</Label><Input value={form.source_url} onChange={(e) => set("source_url", e.target.value)} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Terms / notes</Label><Textarea rows={2} value={form.terms} onChange={(e) => set("terms", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"><Label className="cursor-pointer">Active</Label><Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"><Label className="cursor-pointer">Featured</Label><Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"><Label className="cursor-pointer">Sponsored</Label><Switch checked={form.is_sponsored} onCheckedChange={(v) => set("is_sponsored", v)} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">{isLoading ? "Saving..." : deal ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
