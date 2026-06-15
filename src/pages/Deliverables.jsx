import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Search, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

const allStatuses = ["All", "Not Started", "In Progress", "Uploaded", "Needs Changes", "Approved", "Posted", "Rejected"];

export default function Deliverables() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data: deliverables = [] } = useQuery({
    queryKey: ["deliverables"],
    queryFn: () => hypegrid.entities.Deliverable.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hypegrid.entities.Deliverable.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deliverables"] }),
  });

  const filtered = deliverables.filter(d => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.campaign_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "title", label: "Deliverable", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "campaign_name", label: "Campaign" },
    { key: "client_name", label: "Client" },
    { key: "creator_name", label: "Owner" },
    { key: "platform", label: "Platform" },
    { key: "due_date", label: "Due Date", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "file_url", label: "File", render: (r) => r.file_url ? (
      <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><ExternalLink className="w-3.5 h-3.5" /></a>
    ) : "-" },
    { key: "actions", label: "Action", render: (r) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400" onClick={() => updateMutation.mutate({ id: r.id, data: { status: "Approved" } })}>
          <CheckCircle className="w-3 h-3 mr-1" /> Approve
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-orange-400" onClick={() => updateMutation.mutate({ id: r.id, data: { status: "Needs Changes" } })}>
          <AlertCircle className="w-3 h-3 mr-1" /> Changes
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Content Deliverables</h1>
        <p className="text-sm text-muted-foreground">Central view of all deliverables across all campaigns.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search deliverables..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-muted/30 border-border/40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}