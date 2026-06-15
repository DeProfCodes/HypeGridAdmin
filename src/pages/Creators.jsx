import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, Eye, Pencil, Users, CheckCircle, Clock, Megaphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import CreatorFormDialog from "@/components/creators/CreatorFormDialog";
import { Link } from "react-router-dom";

export default function Creators() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editCreator, setEditCreator] = useState(null);
  const queryClient = useQueryClient();

  const { data: creators = [] } = useQuery({
    queryKey: ["creators"],
    queryFn: () => hypegrid.entities.Creator.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Creator.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["creators"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Creator.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["creators"] }); setEditCreator(null); setShowForm(false); },
  });

  const filtered = creators.filter(c => {
    const matchSearch = !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.handle?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchPlatform = platformFilter === "All" || c.platform === platformFilter;
    return matchSearch && matchStatus && matchPlatform;
  });

  const columns = [
    { key: "full_name", label: "Creator", render: (r) => (
      <Link to={`/creators/${r.id}`} className="font-medium text-foreground hover:text-primary">{r.full_name}</Link>
    )},
    { key: "handle", label: "Handle", render: (r) => <span className="text-xs text-accent">@{r.handle}</span> },
    { key: "platform", label: "Platform" },
    { key: "niche", label: "Niche", render: (r) => <span className="text-xs">{r.niche}</span> },
    { key: "followers", label: "Followers", render: (r) => r.followers ? r.followers.toLocaleString() : "-" },
    { key: "city", label: "City" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "campaigns_count", label: "Campaigns", render: (r) => r.campaigns_count || 0 },
    { key: "actions", label: "", render: (r) => (
      <div className="flex gap-1">
        <Link to={`/creators/${r.id}`}><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button></Link>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditCreator(r); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
      </div>
    )},
  ];

  const approved = creators.filter(c => c.status === "Approved" || c.status === "Active").length;
  const pending = creators.filter(c => c.status === "Applied" || c.status === "Under Review").length;
  const active = creators.filter(c => c.status === "Active").length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Creator Network</h1>
          <p className="text-sm text-muted-foreground">Manage influencers, creators, promoters, content pages, editors, and digital voices.</p>
        </div>
        <Button onClick={() => { setEditCreator(null); setShowForm(true); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Creator
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard title="Total Creators" value={creators.length} icon={Users} variant="default" />
        <StatCard title="Approved" value={approved} icon={CheckCircle} variant="green" />
        <StatCard title="Pending" value={pending} icon={Clock} variant="cyan" />
        <StatCard title="Active on Campaigns" value={active} icon={Megaphone} variant="purple" />
        <StatCard title="Payouts Due" value={0} icon={Wallet} variant="red" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creators..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{["All", "TikTok", "Instagram", "Facebook", "YouTube", "WhatsApp", "Other"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{["All", "Applied", "Under Review", "Approved", "Active", "Suspended", "Rejected", "Archived"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} />

      <CreatorFormDialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditCreator(null); }} creator={editCreator}
        onSubmit={(d) => editCreator ? updateMutation.mutate({ id: editCreator.id, data: d }) : createMutation.mutate(d)}
        isLoading={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
}