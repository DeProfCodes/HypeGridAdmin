import { useQuery } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Eye, MousePointerClick, Percent, Activity } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";

const pct = (v) => `${((v || 0) * 100).toFixed(1)}%`;

function PerfTable({ title, overview }) {
  const columns = [
    { key: "title", label: title, render: (r) => <span className="font-medium text-foreground">{r.title || r.entity_id}</span> },
    { key: "impressions", label: "Impressions", render: (r) => (r.impressions || 0).toLocaleString() },
    { key: "clicks", label: "Clicks", render: (r) => (r.clicks || 0).toLocaleString() },
    { key: "ctr", label: "CTR", render: (r) => pct(r.ctr) },
    { key: "is_active", label: "Status", render: (r) => (
      <span className={`text-xs px-2 py-0.5 rounded ${r.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{r.is_active ? "Active" : "Inactive"}</span>
    )},
  ];
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold font-heading">{title}</h2>
      <DataTable columns={columns} data={overview?.items || []} />
    </div>
  );
}

export default function PlacementAnalytics() {
  const { data: placements } = useQuery({ queryKey: ["analytics", "placements"], queryFn: () => hypegrid.analytics.placements() });
  const { data: deals } = useQuery({ queryKey: ["analytics", "deals"], queryFn: () => hypegrid.analytics.deals() });
  const { data: recent = [] } = useQuery({ queryKey: ["analytics", "recent"], queryFn: () => hypegrid.analytics.recentEvents(20) });

  const totalImpr = (placements?.total_impressions || 0) + (deals?.total_impressions || 0);
  const totalClicks = (placements?.total_clicks || 0) + (deals?.total_clicks || 0);
  const ctr = totalImpr > 0 ? totalClicks / totalImpr : 0;

  const recentColumns = [
    { key: "event_type", label: "Event", render: (r) => <span className="text-xs">{r.event_type}</span> },
    { key: "entity_type", label: "Entity", render: (r) => <span className="text-xs text-muted-foreground">{r.entity_type}</span> },
    { key: "page_path", label: "Page", render: (r) => <span className="text-xs">{r.page_path || "-"}</span> },
    { key: "device_type", label: "Device", render: (r) => <span className="text-xs capitalize">{r.device_type || "-"}</span> },
    { key: "created_date", label: "When", render: (r) => r.created_date ? new Date(r.created_date).toLocaleString() : "-" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Placement Analytics</h1>
        <p className="text-sm text-muted-foreground">HypeGrid-owned performance for hero placements and deals.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Impressions" value={totalImpr.toLocaleString()} icon={Eye} variant="default" />
        <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} variant="green" />
        <StatCard title="Overall CTR" value={pct(ctr)} icon={Percent} variant="cyan" />
        <StatCard title="Recent Events" value={recent.length} icon={Activity} variant="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PerfTable title="Hero Placements" overview={placements} />
        <PerfTable title="Deals" overview={deals} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold font-heading">Recent events</h2>
        <DataTable columns={recentColumns} data={recent} />
      </div>
    </div>
  );
}
