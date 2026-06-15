import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const platforms = ["TikTok", "Instagram", "Facebook", "YouTube", "WhatsApp", "Other"];
const niches = ["Lifestyle", "Music", "Comedy", "Fashion", "Beauty", "Business", "Fitness", "Food", "Events", "Tech", "Other"];
const statuses = ["Applied", "Under Review", "Approved", "Active", "Suspended", "Rejected", "Archived"];

export default function CreatorFormDialog({ open, onOpenChange, creator, onSubmit, isLoading }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", handle: "", platform: "Instagram", niche: "Lifestyle", followers: "", city: "", province: "", status: "Applied", bio: "" });

  useEffect(() => {
    if (creator) setForm({ full_name: creator.full_name || "", email: creator.email || "", phone: creator.phone || "", handle: creator.handle || "", platform: creator.platform || "Instagram", niche: creator.niche || "Lifestyle", followers: creator.followers || "", city: creator.city || "", province: creator.province || "", status: creator.status || "Applied", bio: creator.bio || "" });
    else setForm({ full_name: "", email: "", phone: "", handle: "", platform: "Instagram", niche: "Lifestyle", followers: "", city: "", province: "", status: "Applied", bio: "" });
  }, [creator, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-heading">{creator ? "Edit Creator" : "Add Creator"}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, followers: form.followers ? Number(form.followers) : undefined }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5"><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Phone / WhatsApp</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Handle</Label><Input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} placeholder="@username" /></div>
            <div className="space-y-1.5"><Label>Platform</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Niche</Label>
              <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{niches.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Followers</Label><Input type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Province</Label><Input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">{isLoading ? "Saving..." : creator ? "Update" : "Add Creator"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}