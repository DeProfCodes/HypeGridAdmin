import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const clientTypes = ["Business", "Artist / Musician", "Event Organizer", "Startup / App", "Product Brand", "Personal Brand", "Other"];
const statuses = ["Lead", "Active", "Inactive", "VIP", "Archived"];

export default function ClientFormDialog({ open, onOpenChange, client, onSubmit, isLoading }) {
  const [form, setForm] = useState({ brand_name: "", contact_person: "", email: "", phone: "", client_type: "Business", status: "Lead", location: "", website: "" });

  useEffect(() => {
    if (client) setForm({ brand_name: client.brand_name || "", contact_person: client.contact_person || "", email: client.email || "", phone: client.phone || "", client_type: client.client_type || "Business", status: client.status || "Lead", location: client.location || "", website: client.website || "" });
    else setForm({ brand_name: "", contact_person: "", email: "", phone: "", client_type: "Business", status: "Lead", location: "", website: "" });
  }, [client, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-heading">{client ? "Edit Client" : "Add Client"}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5"><Label>Brand Name</Label><Input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Contact Person</Label><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Type</Label>
              <Select value={form.client_type} onValueChange={(v) => setForm({ ...form, client_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{clientTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">{isLoading ? "Saving..." : client ? "Update" : "Add Client"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}