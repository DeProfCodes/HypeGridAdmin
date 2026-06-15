import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Megaphone, Inbox, Briefcase, Palette, FileCheck,
  DollarSign, Wallet, Clock, ArrowRight, TrendingUp
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { hypegrid } from "@/api/hypegridClient";
import { useQuery } from "@tanstack/react-query";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function Dashboard() {
  const { userRole } = useOutletContext();

  const { data: campaigns = [] } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => hypegrid.entities.Campaign.list("-created_date", 50),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["requests"],
    queryFn: () => hypegrid.entities.CampaignRequest.list("-created_date", 20),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => hypegrid.entities.Client.list(),
  });

  const { data: creators = [] } = useQuery({
    queryKey: ["creators"],
    queryFn: () => hypegrid.entities.Creator.list(),
  });

  const { data: deliverables = [] } = useQuery({
    queryKey: ["deliverables"],
    queryFn: () => hypegrid.entities.Deliverable.list("-created_date", 20),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => hypegrid.entities.Invoice.list(),
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => hypegrid.entities.Payout.list(),
  });

  const activeCampaigns = campaigns.filter(c => ["Active", "In Planning", "Content Pending", "Client Review"].includes(c.status));
  const pendingRequests = requests.filter(r => ["New", "Contacted"].includes(r.status));
  const pendingDeliverables = deliverables.filter(d => ["Not Started", "In Progress", "Needs Changes"].includes(d.status));
  const monthlyRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.paid_amount || 0), 0);
  const pendingPayouts = payouts.filter(p => p.status === "Pending");
  const awaitingApproval = campaigns.filter(c => c.status === "Awaiting Payment");

  const recentRequestCols = [
    { key: "created_date", label: "Date", render: (r) => new Date(r.created_date).toLocaleDateString() },
    { key: "brand_name", label: "Client / Brand" },
    { key: "campaign_type", label: "Type" },
    { key: "budget_range", label: "Budget" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const activeCampaignCols = [
    { key: "name", label: "Campaign" },
    { key: "client_name", label: "Client" },
    { key: "type", label: "Type" },
    { key: "progress", label: "Progress", render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${r.progress || 0}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{r.progress || 0}%</span>
      </div>
    )},
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "manager", label: "Manager" },
  ];

  const pendingDeliverableCols = [
    { key: "creator_name", label: "Creator" },
    { key: "campaign_name", label: "Campaign" },
    { key: "title", label: "Deliverable" },
    { key: "due_date", label: "Due Date", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-heading">Campaign Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track campaigns, creators, clients, deliverables, and revenue from one place.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Campaigns" value={activeCampaigns.length} icon={Megaphone} variant="green" />
        <StatCard title="Pending Requests" value={pendingRequests.length} icon={Inbox} variant="cyan" />
        <StatCard title="Active Clients" value={clients.filter(c => c.status === "Active").length} icon={Briefcase} variant="default" />
        <StatCard title="Creator Network" value={creators.length} icon={Palette} variant="purple" />
        <StatCard title="Pending Deliverables" value={pendingDeliverables.length} icon={FileCheck} variant="cyan" />
        <StatCard title="Monthly Revenue" value={`R ${monthlyRevenue.toLocaleString()}`} icon={DollarSign} variant="green" />
        <StatCard title="Payouts Due" value={pendingPayouts.length} icon={Wallet} variant="red" />
        <StatCard title="Awaiting Approval" value={awaitingApproval.length} icon={Clock} variant="default" />
      </div>

      {/* Charts */}
      <DashboardCharts campaigns={campaigns} invoices={invoices} deliverables={deliverables} />

      {/* Tables */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold font-heading">Recent Campaign Requests</h2>
            <Link to="/requests" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <DataTable columns={recentRequestCols} data={requests.slice(0, 5)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold font-heading">Active Campaigns</h2>
            <Link to="/campaigns" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <DataTable columns={activeCampaignCols} data={activeCampaigns.slice(0, 5)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold font-heading">Pending Deliverables</h2>
            <Link to="/deliverables" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <DataTable columns={pendingDeliverableCols} data={pendingDeliverables.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}