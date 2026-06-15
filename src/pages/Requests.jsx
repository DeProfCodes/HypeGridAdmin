import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Search, Eye, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statuses = ["All", "New", "Contacted", "Qualified", "Quote Needed", "Converted", "Not Suitable", "Closed"];

export default function Requests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ["requests"],
    queryFn: () => hypegrid.entities.CampaignRequest.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.CampaignRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
  });

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.full_name?.toLowerCase().includes(search.toLowerCase()) || r.brand_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "created_date", label: "Date", render: (r) => new Date(r.created_date).toLocaleDateString() },
    { key: "full_name", label: "Name" },
    { key: "brand_name", label: "Brand" },
    { key: "campaign_type", label: "Campaign Type", render: (r) => <span className="text-xs">{r.campaign_type}</span> },
    { key: "budget_range", label: "Budget" },
    { key: "campaign_goal", label: "Goal", render: (r) => <span className="text-xs truncate max-w-[150px] block">{r.campaign_goal}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "assigned_to", label: "Assigned To" },
    { key: "actions", label: "", render: (r) => (
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(r)}><Eye className="w-3.5 h-3.5" /></Button>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Campaign Requests</h1>
        <p className="text-sm text-muted-foreground">Review incoming campaign enquiries from businesses, artists, events, and brands.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Campaign Request</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground text-xs">Name</span><p className="font-medium">{selected.full_name}</p></div>
                <div><span className="text-muted-foreground text-xs">Brand</span><p className="font-medium">{selected.brand_name}</p></div>
                <div><span className="text-muted-foreground text-xs">Email</span><p>{selected.email}</p></div>
                <div><span className="text-muted-foreground text-xs">Phone</span><p>{selected.phone}</p></div>
                <div><span className="text-muted-foreground text-xs">Campaign Type</span><p>{selected.campaign_type}</p></div>
                <div><span className="text-muted-foreground text-xs">Budget Range</span><p>{selected.budget_range}</p></div>
                <div><span className="text-muted-foreground text-xs">Target Audience</span><p>{selected.target_audience}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
              </div>
              <div><span className="text-muted-foreground text-xs">Campaign Goal</span><p className="text-sm mt-1">{selected.campaign_goal}</p></div>
              <div><span className="text-muted-foreground text-xs">Message</span><p className="text-sm mt-1">{selected.message}</p></div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Select value={selected.status} onValueChange={(v) => { updateMutation.mutate({ id: selected.id, data: { status: v } }); setSelected({ ...selected, status: v }); }}>
                  <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}