import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, Pencil, Images, Eye, MousePointerClick, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import HeroPlacementFormDialog from "@/components/marketing/HeroPlacementFormDialog";

export default function HeroAds() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: placements = [] } = useQuery({
    queryKey: ["heroPlacements"],
    queryFn: () => hypegrid.entities.HeroPlacement.list("priority", 100),
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics", "placements"],
    queryFn: () => hypegrid.analytics.placements(),
  });

  const statsById = useMemo(() => {
    const map = {};
    (analytics?.items || []).forEach((i) => { map[i.entity_id] = i; });
    return map;
  }, [analytics]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["heroPlacements"] });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.HeroPlacement.create(d),
    onSuccess: () => { invalidate(); setShowForm(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.HeroPlacement.update(id, data),
    onSuccess: () => { invalidate(); setEditItem(null); setShowForm(false); },
  });
  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }) => hypegrid.entities.HeroPlacement.update(id, { is_active }),
    onSuccess: invalidate,
  });

  const filtered = placements.filter((p) =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.sponsor_name?.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: "title", label: "Placement", render: (r) => (
      <div>
        <p className="font-medium text-foreground">{r.title}</p>
        {r.sponsor_name && <p className="text-xs text-muted-foreground">Sponsor: {r.sponsor_name}</p>}
      </div>
    )},
    { key: "badge", label: "Badge", render: (r) => r.badge ? <span className="text-xs px-2 py-0.5 rounded bg-secondary/10 text-secondary">{r.badge}</span> : "-" },
    { key: "cta_target_type", label: "Target", render: (r) => <span className="text-xs capitalize">{r.cta_target_type}</span> },
    { key: "priority", label: "Priority" },
    { key: "impressions", label: "Impr.", render: (r) => (statsById[r.id]?.impressions ?? 0).toLocaleString() },
    { key: "clicks", label: "Clicks", render: (r) => (statsById[r.id]?.clicks ?? 0).toLocaleString() },
    { key: "ctr", label: "CTR", render: (r) => statsById[r.id] ? `${(statsById[r.id].ctr * 100).toFixed(1)}%` : "-" },
    { key: "is_active", label: "Active", render: (r) => (
      <Switch checked={!!r.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: r.id, is_active: v })} />
    )},
    { key: "actions", label: "", render: (r) => (
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditItem(r); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
    )},
  ];

  const activeCount = placements.filter((p) => p.is_active).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Hero Ads</h1>
          <p className="text-sm text-muted-foreground">Manage the homepage hero carousel — sellable advertising inventory.</p>
        </div>
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Placement
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Placements" value={placements.length} icon={Images} variant="default" />
        <StatCard title="Active" value={activeCount} icon={Megaphone} variant="green" />
        <StatCard title="Impressions" value={(analytics?.total_impressions ?? 0).toLocaleString()} icon={Eye} variant="cyan" />
        <StatCard title="Clicks" value={(analytics?.total_clicks ?? 0).toLocaleString()} icon={MousePointerClick} variant="purple" />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search placements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
      </div>

      <DataTable columns={columns} data={filtered} />

      <HeroPlacementFormDialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditItem(null); }} placement={editItem}
        onSubmit={(d) => editItem ? updateMutation.mutate({ id: editItem.id, data: d }) : createMutation.mutate(d)}
        isLoading={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
}
