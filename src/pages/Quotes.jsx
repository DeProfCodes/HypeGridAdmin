import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, Eye, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const packages = ["Starter Hype", "Growth Hype", "Premium Launch", "Monthly Brand Management", "Music Release Push", "Custom Campaign"];
const statuses = ["All", "Draft", "Sent", "Accepted", "Rejected", "Expired", "Converted to Invoice"];

export default function Quotes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ quote_number: "", client_name: "", campaign_type: "Business Promotion", package_name: "Starter Hype", amount: "", status: "Draft", notes: "" });
  const queryClient = useQueryClient();

  const { data: quotes = [] } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => hypegrid.entities.Quote.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Quote.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["quotes"] }); setShowForm(false); },
  });

  const filtered = quotes.filter(q => {
    const matchSearch = !search || q.client_name?.toLowerCase().includes(search.toLowerCase()) || q.quote_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "quote_number", label: "Quote No", render: (r) => <span className="font-medium text-primary">{r.quote_number}</span> },
    { key: "client_name", label: "Client" },
    { key: "campaign_type", label: "Campaign Type", render: (r) => <span className="text-xs">{r.campaign_type}</span> },
    { key: "package_name", label: "Package", render: (r) => <span className="text-xs">{r.package_name}</span> },
    { key: "amount", label: "Amount", render: (r) => r.amount ? `R ${r.amount.toLocaleString()}` : "-" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "created_date", label: "Date", render: (r) => new Date(r.created_date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Quotes & Packages</h1>
          <p className="text-sm text-muted-foreground">Manage quotes sent to clients.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Create Quote
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search quotes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Create Quote</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, amount: Number(form.amount) }); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Quote Number</Label><Input value={form.quote_number} onChange={(e) => setForm({ ...form, quote_number: e.target.value })} required placeholder="HG-Q-001" /></div>
              <div className="space-y-1.5"><Label>Client</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Package</Label>
                <Select value={form.package_name} onValueChange={(v) => setForm({ ...form, package_name: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{packages.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Amount (R)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
            </div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground">{createMutation.isPending ? "Creating..." : "Create Quote"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}