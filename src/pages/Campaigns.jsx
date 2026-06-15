import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Pencil, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import CampaignFormDialog from "@/components/campaigns/CampaignFormDialog";

const statuses = ["All", "Draft", "Requested", "Quoted", "Awaiting Payment", "Approved", "In Planning", "Active", "Content Pending", "Client Review", "Completed", "Cancelled"];
const types = ["All", "Business Promotion", "Song / Music Release", "Event Promotion", "Product Promotion", "App / Startup Launch", "Influencer Campaign", "Social Media Management", "Other"];

export default function Campaigns() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);

  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => hypegrid.entities.Campaign.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => hypegrid.entities.Campaign.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["campaigns"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Campaign.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["campaigns"] }); setEditCampaign(null); setShowForm(false); },
  });

  const filtered = campaigns.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchType = typeFilter === "All" || c.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const columns = [
    { key: "name", label: "Campaign", render: (r) => (
      <Link to={`/campaigns/${r.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{r.name}</Link>
    )},
    { key: "client_name", label: "Client" },
    { key: "type", label: "Type", render: (r) => <span className="text-xs">{r.type}</span> },
    { key: "budget", label: "Budget", render: (r) => r.budget ? `R ${r.budget.toLocaleString()}` : "-" },
    { key: "progress", label: "Progress", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${r.progress || 0}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{r.progress || 0}%</span>
      </div>
    )},
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "start_date", label: "Start", render: (r) => r.start_date ? new Date(r.start_date).toLocaleDateString() : "-" },
    { key: "manager", label: "Manager" },
    { key: "actions", label: "Actions", render: (r) => (
      <div className="flex items-center gap-1">
        <Link to={`/campaigns/${r.id}`}>
          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditCampaign(r); setShowForm(true); }}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage all client campaigns from request to delivery.</p>
        </div>
        <Button onClick={() => { setEditCampaign(null); setShowForm(true); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No campaigns found" />

      <CampaignFormDialog
        open={showForm}
        onOpenChange={(open) => { setShowForm(open); if (!open) setEditCampaign(null); }}
        campaign={editCampaign}
        onSubmit={(data) => {
          if (editCampaign) {
            updateMutation.mutate({ id: editCampaign.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}