import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import ClientFormDialog from "@/components/clients/ClientFormDialog";
import { Link } from "react-router-dom";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => hypegrid.entities.Client.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Client.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Client.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); setEditClient(null); setShowForm(false); },
  });

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.brand_name?.toLowerCase().includes(search.toLowerCase()) || c.contact_person?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "brand_name", label: "Client / Brand", render: (r) => (
      <Link to={`/clients/${r.id}`} className="font-medium text-foreground hover:text-primary">{r.brand_name}</Link>
    )},
    { key: "contact_person", label: "Contact" },
    { key: "email", label: "Email", render: (r) => <span className="text-xs">{r.email}</span> },
    { key: "client_type", label: "Type", render: (r) => <span className="text-xs">{r.client_type}</span> },
    { key: "active_campaigns", label: "Campaigns", render: (r) => r.active_campaigns || 0 },
    { key: "total_spend", label: "Total Spend", render: (r) => r.total_spend ? `R ${r.total_spend.toLocaleString()}` : "R 0" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1">
        <Link to={`/clients/${r.id}`}><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button></Link>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditClient(r); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Clients</h1>
          <p className="text-sm text-muted-foreground">Businesses, artists, brands, event organizers, and startups using HypeGrid.</p>
        </div>
        <Button onClick={() => { setEditClient(null); setShowForm(true); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Client
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["All", "Lead", "Active", "Inactive", "VIP", "Archived"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />
      <ClientFormDialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditClient(null); }} client={editClient}
        onSubmit={(d) => editClient ? updateMutation.mutate({ id: editClient.id, data: d }) : createMutation.mutate(d)}
        isLoading={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
}