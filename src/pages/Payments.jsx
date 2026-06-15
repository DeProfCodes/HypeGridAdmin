import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, DollarSign, CreditCard, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const invoiceStatuses = ["All", "Draft", "Sent", "Paid", "Partially Paid", "Overdue", "Cancelled"];

export default function Payments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ invoice_number: "", client_name: "", campaign_name: "", amount: "", status: "Draft", due_date: "" });
  const queryClient = useQueryClient();

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => hypegrid.entities.Invoice.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Invoice.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["invoices"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Invoice.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });

  const totalRevenue = invoices.reduce((s, i) => s + (i.paid_amount || 0), 0);
  const outstanding = invoices.reduce((s, i) => s + (i.outstanding || 0), 0);
  const overdue = invoices.filter(i => i.status === "Overdue").length;
  const pending = invoices.filter(i => i.status === "Sent" || i.status === "Draft").length;

  const filtered = invoices.filter(i => {
    const matchSearch = !search || i.client_name?.toLowerCase().includes(search.toLowerCase()) || i.invoice_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "invoice_number", label: "Invoice No", render: (r) => <span className="font-medium text-primary">{r.invoice_number}</span> },
    { key: "client_name", label: "Client" },
    { key: "campaign_name", label: "Campaign" },
    { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
    { key: "paid_amount", label: "Paid", render: (r) => `R ${(r.paid_amount || 0).toLocaleString()}` },
    { key: "outstanding", label: "Outstanding", render: (r) => <span className={r.outstanding > 0 ? "text-orange-400" : ""}>{`R ${(r.outstanding || 0).toLocaleString()}`}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "due_date", label: "Due", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
    { key: "actions", label: "", render: (r) => (
      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400" onClick={() => updateMutation.mutate({ id: r.id, data: { status: "Paid", paid_amount: r.amount, outstanding: 0 } })}>
        Mark Paid
      </Button>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Payments & Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage client payments and invoices.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Revenue" value={`R ${totalRevenue.toLocaleString()}`} icon={DollarSign} variant="green" />
        <StatCard title="Outstanding" value={`R ${outstanding.toLocaleString()}`} icon={CreditCard} variant="cyan" />
        <StatCard title="Overdue" value={overdue} icon={AlertTriangle} variant="red" />
        <StatCard title="Pending Invoices" value={pending} icon={Clock} variant="default" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{invoiceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Create Invoice</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const amt = Number(form.amount); createMutation.mutate({ ...form, amount: amt, outstanding: amt, paid_amount: 0 }); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Invoice No</Label><Input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} required placeholder="HG-INV-001" /></div>
              <div className="space-y-1.5"><Label>Client</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Campaign</Label><Input value={form.campaign_name} onChange={(e) => setForm({ ...form, campaign_name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Amount (R)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground">{createMutation.isPending ? "Creating..." : "Create Invoice"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}