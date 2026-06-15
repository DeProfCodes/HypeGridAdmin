import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploadField from "@/components/marketing/ImageUploadField";

const targetTypes = ["internal", "external", "whatsapp", "deal", "campaign"];

const empty = {
  title: "", subtitle: "", badge: "", sponsor_name: "",
  desktop_image_url: "", mobile_image_url: "",
  cta_text: "", cta_url: "", cta_target_type: "internal", campaign_reference: "",
  start_date: "", end_date: "", priority: 0, is_active: true, tracking_enabled: true,
};

// Date inputs hold YYYY-MM-DD; convert to/from ISO instants for the API.
const toDateInput = (iso) => (iso ? String(iso).slice(0, 10) : "");
const toIso = (d) => (d ? new Date(d).toISOString() : null);

export default function HeroPlacementFormDialog({ open, onOpenChange, placement, onSubmit, isLoading }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (placement) {
      setForm({
        ...empty,
        ...placement,
        sponsor_name: placement.sponsor_name || "",
        campaign_reference: placement.campaign_reference || "",
        start_date: toDateInput(placement.start_date),
        end_date: toDateInput(placement.end_date),
        priority: placement.priority ?? 0,
        is_active: placement.is_active ?? true,
        tracking_enabled: placement.tracking_enabled ?? true,
      });
    } else setForm(empty);
  }, [placement, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      priority: Number(form.priority) || 0,
      start_date: toIso(form.start_date),
      end_date: toIso(form.end_date),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{placement ? "Edit Hero Placement" : "New Hero Placement"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
            <div className="col-span-2 space-y-1.5"><Label>Subtitle</Label><Textarea rows={2} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Badge / Category</Label><Input value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Featured" /></div>
            <div className="space-y-1.5"><Label>Sponsor / Brand</Label><Input value={form.sponsor_name} onChange={(e) => set("sponsor_name", e.target.value)} placeholder="Optional" /></div>
            <div className="col-span-2"><ImageUploadField label="Desktop image" recommended="1920×1080" category="hero-desktop" value={form.desktop_image_url} onChange={(url) => set("desktop_image_url", url)} /></div>
            <div className="col-span-2"><ImageUploadField label="Mobile image" recommended="1080×1920 · optional, falls back to desktop" category="hero-mobile" value={form.mobile_image_url} onChange={(url) => set("mobile_image_url", url)} /></div>
            <div className="space-y-1.5"><Label>CTA text</Label><Input value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} placeholder="Explore" /></div>
            <div className="space-y-1.5"><Label>CTA URL</Label><Input value={form.cta_url} onChange={(e) => set("cta_url", e.target.value)} placeholder="/deals or https://…" /></div>
            <div className="space-y-1.5"><Label>CTA target</Label>
              <Select value={form.cta_target_type} onValueChange={(v) => set("cta_target_type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{targetTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Campaign / deal ref</Label><Input value={form.campaign_reference} onChange={(e) => set("campaign_reference", e.target.value)} placeholder="Optional slug/id" /></div>
            <div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>End date</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Priority <span className="text-muted-foreground">(lower first)</span></Label><Input type="number" value={form.priority} onChange={(e) => set("priority", e.target.value)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"><Label className="cursor-pointer">Active</Label><Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 col-span-2"><Label className="cursor-pointer">Tracking enabled</Label><Switch checked={form.tracking_enabled} onCheckedChange={(v) => set("tracking_enabled", v)} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">{isLoading ? "Saving..." : placement ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
