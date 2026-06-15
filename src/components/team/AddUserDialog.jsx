import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Roles a SuperAdmin can assign. Client/Creator exist for the future
// self-service portal but are selectable here too.
export const ASSIGNABLE_ROLES = [
  "SuperAdmin", "Admin", "CampaignManager", "Finance", "Support", "Client", "Creator",
];

const EMPTY = { firstName: "", lastName: "", email: "", password: "", role: "Support" };

export default function AddUserDialog({ open, onOpenChange, onSubmit, isLoading }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { if (open) setForm(EMPTY); }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-heading">Add Team Member</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
            <div className="col-span-2 space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="col-span-2 space-y-1.5"><Label>Temporary Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars, upper, lower, digit, symbol" required /></div>
            <div className="col-span-2 space-y-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ASSIGNABLE_ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">{isLoading ? "Creating…" : "Create User"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
