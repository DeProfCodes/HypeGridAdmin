import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Trash2, Users, BellRing, MessageCircle, Percent, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAlertsStore } from "@/stores/alertsStore";

const STATUSES = ["All", "New", "Active", "OptedOut", "Archived"];
const MANAGE_STATUSES = ["New", "Active", "OptedOut", "Archived"];
const CLICKED = ["All", "Clicked", "Not clicked"];
const INTERESTS = ["All", "Food", "Grocery", "Fashion", "Beauty", "Tech", "Mobile", "Home", "Events", "Music", "Travel", "Services", "Apps", "All Deals"];

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString() : "—");
const fmtDateTime = (v) => (v ? new Date(v).toLocaleString() : "—");

export default function AlertSubscribers() {
  const subscribers = useAlertsStore((s) => s.subscribers);
  const summary = useAlertsStore((s) => s.summary);
  const loading = useAlertsStore((s) => s.subscribersLoading);
  const fetchSubscribers = useAlertsStore((s) => s.fetchSubscribers);
  const fetchSummary = useAlertsStore((s) => s.fetchSummary);
  const setStatus = useAlertsStore((s) => s.setStatus);
  const removeSubscriber = useAlertsStore((s) => s.removeSubscriber);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [clickedFilter, setClickedFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchSubscribers();
    fetchSummary();
  }, [fetchSubscribers, fetchSummary]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (subscribers || []).filter((r) => {
      const matchSearch = !q
        || r.full_name?.toLowerCase().includes(q)
        || r.email?.toLowerCase().includes(q)
        || r.phone_number?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchClicked = clickedFilter === "All"
        || (clickedFilter === "Clicked" ? r.channel_join_clicked : !r.channel_join_clicked);
      const matchInterest = interestFilter === "All" || (r.interests || []).includes(interestFilter);
      return matchSearch && matchStatus && matchClicked && matchInterest;
    });
  }, [subscribers, search, statusFilter, clickedFilter, interestFilter]);

  const ctrPct = summary ? `${Math.round((summary.click_through_rate || 0) * 1000) / 10}%` : "—";

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete subscriber ${row.full_name || row.email || row.phone_number || ""}? This cannot be undone.`)) return;
    await removeSubscriber(row.id);
    setSelected(null);
  };

  const handleStatus = async (row, status) => {
    await setStatus(row.id, status);
    setSelected((prev) => (prev ? { ...prev, status } : prev));
  };

  const columns = [
    { key: "created_date", label: "Date", render: (r) => fmtDate(r.created_date) },
    { key: "full_name", label: "Name", render: (r) => r.full_name || "—" },
    { key: "email", label: "Email", render: (r) => r.email || "—" },
    { key: "phone_number", label: "Phone", render: (r) => r.phone_number || "—" },
    { key: "location", label: "Province / City", render: (r) => [r.province, r.city].filter(Boolean).join(" · ") || "—" },
    { key: "interests", label: "Interests", render: (r) => <span className="text-xs">{(r.interests || []).join(", ") || "—"}</span> },
    { key: "consent_at", label: "Consent", render: (r) => fmtDate(r.consent_at) },
    { key: "channel_join_clicked", label: "Clicked", render: (r) => (
      r.channel_join_clicked
        ? <span className="text-xs text-[#CCFF00]">Yes · {fmtDate(r.channel_join_clicked_at)}</span>
        : <span className="text-xs text-muted-foreground">No</span>
    ) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", render: (r) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(r)}><Eye className="w-3.5 h-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDelete(r)}><Trash2 className="w-3.5 h-3.5" /></Button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">HypeGrid Alerts</h1>
        <p className="text-sm text-muted-foreground">Consent-based Deals Club audience. Subscribers opted in via the public questionnaire and can join the WhatsApp Channel.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Subscribers" value={summary?.total ?? "—"} icon={Users} variant="cyan" />
        <StatCard title="Active" value={summary?.active ?? "—"} icon={BellRing} variant="green" />
        <StatCard title="Channel Clicks" value={summary?.channel_clicked ?? "—"} icon={MessageCircle} variant="green" />
        <StatCard title="Click-through Rate" value={ctrPct} icon={Percent} variant="default" />
        <StatCard title="Opted Out" value={summary?.opted_out ?? "—"} icon={UserX} variant="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-muted/30 border-border/40 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All statuses" : s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={clickedFilter} onValueChange={setClickedFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue placeholder="Clicked" /></SelectTrigger>
          <SelectContent>{CLICKED.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All (clicked?)" : s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={interestFilter} onValueChange={setInterestFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border/40 h-9"><SelectValue placeholder="Interest" /></SelectTrigger>
          <SelectContent>{INTERESTS.map((s) => <SelectItem key={s} value={s}>{s === "All" ? "All interests" : s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage={loading ? "Loading subscribers..." : "No subscribers match your filters yet."} />

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Subscriber</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground text-xs">Name</span><p className="font-medium">{selected.full_name || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
                <div><span className="text-muted-foreground text-xs">Email</span><p>{selected.email || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Phone</span><p>{selected.phone_number || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Province / City</span><p>{[selected.province, selected.city].filter(Boolean).join(" · ") || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Frequency</span><p>{selected.frequency_preference || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Source page</span><p>{selected.source_page || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Channel clicked</span><p>{selected.channel_join_clicked ? fmtDateTime(selected.channel_join_clicked_at) : "No"}</p></div>
              </div>
              <div><span className="text-muted-foreground text-xs">Interests</span><p className="text-sm mt-1">{(selected.interests || []).join(", ") || "—"}</p></div>

              <div className="rounded-lg border border-border/40 bg-muted/20 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consent</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs">Version</span><p>{selected.consent_text_version || "—"}</p></div>
                  <div><span className="text-muted-foreground text-xs">Captured</span><p>{fmtDateTime(selected.consent_at)}</p></div>
                </div>
                <div><span className="text-muted-foreground text-xs">Consent text shown</span><p className="text-xs mt-1 text-muted-foreground">{selected.consent_snapshot || "—"}</p></div>
                {selected.consent_user_agent && (
                  <div><span className="text-muted-foreground text-xs">User agent</span><p className="text-xs mt-1 text-muted-foreground break-all">{selected.consent_user_agent}</p></div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-muted-foreground text-xs">Set status</span>
                <Select value={selected.status} onValueChange={(v) => handleStatus(selected, v)}>
                  <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{MANAGE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 ml-auto" onClick={() => handleDelete(selected)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
