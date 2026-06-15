import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, Search, Pencil, Tag, Star, Eye, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import DealFormDialog from "@/components/marketing/DealFormDialog";

const categories = ["All", "Food", "Grocery", "Fashion", "Beauty", "Tech", "Mobile", "Home", "Events", "Music", "Travel", "Services", "Apps", "Other"];

export default function Deals() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: () => hypegrid.entities.Deal.list("priority", 200),
  });
  const { data: analytics } = useQuery({
    queryKey: ["analytics", "deals"],
    queryFn: () => hypegrid.analytics.deals(),
  });

  const statsById = useMemo(() => {
    const map = {};
    (analytics?.items || []).forEach((i) => { map[i.entity_id] = i; });
    return map;
  }, [analytics]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["deals"] });
  const createMutation = useMutation({ mutationFn: (d) => hypegrid.entities.Deal.create(d), onSuccess: () => { invalidate(); setShowForm(false); } });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => hypegrid.entities.Deal.update(id, data), onSuccess: () => { invalidate(); setEditItem(null); setShowForm(false); } });
  const toggleActive = useMutation({ mutationFn: ({ id, is_active }) => hypegrid.entities.Deal.update(id, { is_active }), onSuccess: invalidate });
  const toggleFeatured = useMutation({ mutationFn: ({ id, is_featured }) => hypegrid.entities.Deal.update(id, { is_featured }), onSuccess: invalidate });

  const filtered = deals.filter((d) => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.brand_name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const columns = [
    { key: "title", label: "Deal", render: (r) => (
      <div>
        <p className="font-medium text-foreground">{r.title}</p>
        <p className="text-xs text-muted-foreground">{r.brand_name}{r.is_sponsored ? " · Sponsored" : ""}</p>
      </div>
    )},
    { key: "category", label: "Category", render: (r) => <span className="text-xs">{r.category}</span> },
    { key: "discount_label", label: "Discount", render: (r) => r.discount_label ? <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{r.discount_label}</span> : "-" },
    { key: "valid_until", label: "Valid until", render: (r) => r.valid_until ? String(r.valid_until).slice(0, 10) : "-" },
    { key: "impressions", label: "Views", render: (r) => (statsById[r.id]?.impressions ?? 0).toLocaleString() },
    { key: "clicks", label: "Clicks", render: (r) => (statsById[r.id]?.clicks ?? 0).toLocaleString() },
    { key: "is_featured", label: "Featured", render: (r) => (
      <Switch checked={!!r.is_featured} onCheckedChange={(v) => toggleFeatured.mutate({ id: r.id, is_featured: v })} />
    )},
    { key: "is_active", label: "Active", render: (r) => (
      <Switch checked={!!r.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: r.id, is_active: v })} />
    )},
    { key: "actions", label: "", render: (r) => (
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditItem(r); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
    )},
  ];

  const active = deals.filter((d) => d.is_active).length;
  const featured = deals.filter((d) => d.is_featured).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Deals & Specials</h1>
          <p className="text-sm text-muted-foreground">Publish specials, discounts and offers from shops and brands. Admin-entered only.</p>
        </div>
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Deal
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Deals" value={deals.length} icon={Tag} variant="default" />
        <StatCard title="Active" value={active} icon={Eye} variant="green" />
        <StatCard title="Featured" value={featured} icon={Star} variant="cyan" />
        <StatCard title="Total Clicks" value={(analytics?.total_clicks ?? 0).toLocaleString()} icon={MousePointerClick} variant="purple" />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} />

      <DealFormDialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditItem(null); }} deal={editItem}
        onSubmit={(d) => editItem ? updateMutation.mutate({ id: editItem.id, data: d }) : createMutation.mutate(d)}
        isLoading={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
}
