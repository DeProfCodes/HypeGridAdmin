import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const types = ["Business Promotion", "Song / Music Release", "Event Promotion", "Product Promotion", "App / Startup Launch", "Influencer Campaign", "Social Media Management", "Other"];
const statuses = ["Draft", "Requested", "Quoted", "Awaiting Payment", "Approved", "In Planning", "Active", "Content Pending", "Client Review", "Completed", "Cancelled"];

export default function CampaignFormDialog({ open, onOpenChange, campaign, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: "", client_name: "", type: "Business Promotion", status: "Draft",
    budget: "", start_date: "", end_date: "", manager: "", objective: "", target_audience: "", brief: ""
  });

  useEffect(() => {
    if (campaign) {
      setForm({
        name: campaign.name || "",
        client_name: campaign.client_name || "",
        type: campaign.type || "Business Promotion",
        status: campaign.status || "Draft",
        budget: campaign.budget || "",
        start_date: campaign.start_date || "",
        end_date: campaign.end_date || "",
        manager: campaign.manager || "",
        objective: campaign.objective || "",
        target_audience: campaign.target_audience || "",
        brief: campaign.brief || "",
      });
    } else {
      setForm({ name: "", client_name: "", type: "Business Promotion", status: "Draft", budget: "", start_date: "", end_date: "", manager: "", objective: "", target_audience: "", brief: "" });
    }
  }, [campaign, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, budget: form.budget ? Number(form.budget) : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{campaign ? "Edit Campaign" : "New Campaign"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Campaign Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Client</Label>
              <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Manager</Label>
              <Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Budget (R)</Label>
              <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Objective</Label>
            <Textarea value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Target Audience</Label>
            <Input value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? "Saving..." : campaign ? "Update" : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}