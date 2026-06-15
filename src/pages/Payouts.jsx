import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, DollarSign, Wallet, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const payoutStatuses = ["All", "Pending", "Approved", "Paid", "On Hold", "Cancelled"];

export default function Payouts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ creator_name: "", campaign_name: "", deliverable: "", amount: "", status: "Pending", due_date: "" });
  const queryClient = useQueryClient();

  const { data: payouts = [] } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => hypegrid.entities.Payout.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Payout.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["payouts"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Payout.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payouts"] }),
  });

  const totalEarnings = payouts.reduce((s, p) => s + (p.amount || 0), 0);
  const paidOut = payouts.filter(p => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payouts.filter(p => p.status === "Pending" || p.status === "Approved").reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = payouts.filter(p => {
    const matchSearch = !search || p.creator_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "creator_name", label: "Creator", render: (r) => <span className="font-medium">{r.creator_name}</span> },
    { key: "campaign_name", label: "Campaign" },
    { key: "deliverable", label: "Deliverable" },
    { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "due_date", label: "Due", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
    { key: "paid_date", label: "Paid Date", render: (r) => r.paid_date ? new Date(r.paid_date).toLocaleDateString() : "-" },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1">
        {r.status === "Pending" && <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400" onClick={() => updateMutation.mutate({ id: r.id, data: { status: "Approved" } })}>Approve</Button>}
        {(r.status === "Approved" || r.status === "Pending") && <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400" onClick={() => updateMutation.mutate({ id: r.id, data: { status: "Paid", paid_date: new Date().toISOString().split("T")[0] } })}>Mark Paid</Button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Creator Payouts</h1>
          <p className="text-sm text-muted-foreground">Manage creator and influencer payments.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Record Payout
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Earnings" value={`R ${totalEarnings.toLocaleString()}`} icon={DollarSign} variant="green" />
        <StatCard title="Paid Out" value={`R ${paidOut.toLocaleString()}`} icon={Wallet} variant="cyan" />
        <StatCard title="Pending" value={`R ${pendingAmount.toLocaleString()}`} icon={Clock} variant="default" />
        <StatCard title="Overdue" value={payouts.filter(p => p.status === "Pending").length} icon={AlertTriangle} variant="red" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search payouts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{payoutStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Record Payout</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, amount: Number(form.amount) }); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Creator</Label><Input value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Campaign</Label><Input value={form.campaign_name} onChange={(e) => setForm({ ...form, campaign_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Deliverable</Label><Input value={form.deliverable} onChange={(e) => setForm({ ...form, deliverable: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Amount (R)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground">{createMutation.isPending ? "Saving..." : "Record Payout"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}