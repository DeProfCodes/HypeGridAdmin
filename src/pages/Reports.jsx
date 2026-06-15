import { useQuery } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { BarChart3, Megaphone, CheckCircle, DollarSign, Users, FileCheck } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const COLORS = ["#CCFF00", "#00E5FF", "#334CCC", "#CC33CC", "#E23670", "#94A3B8"];

export default function Reports() {
  const { data: campaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: () => hypegrid.entities.Campaign.list() });
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: () => hypegrid.entities.Invoice.list() });
  const { data: creators = [] } = useQuery({ queryKey: ["creators"], queryFn: () => hypegrid.entities.Creator.list() });
  const { data: deliverables = [] } = useQuery({ queryKey: ["deliverables"], queryFn: () => hypegrid.entities.Deliverable.list() });

  const totalRevenue = invoices.reduce((s, i) => s + (i.paid_amount || 0), 0);
  const avgValue = campaigns.length ? Math.round(campaigns.reduce((s, c) => s + (c.budget || 0), 0) / campaigns.length) : 0;
  const completedCampaigns = campaigns.filter(c => c.status === "Completed").length;
  const completedDeliverables = deliverables.filter(d => d.status === "Approved" || d.status === "Posted").length;

  const typeCounts = {};
  campaigns.forEach(c => { if (c.type) typeCounts[c.type] = (typeCounts[c.type] || 0) + 1; });
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 18) + "…" : name, value }));

  const statusCounts = {};
  campaigns.forEach(c => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-border/60 text-xs">
          <p className="text-foreground font-medium">{payload[0].name || payload[0].payload?.name}</p>
          <p className="text-primary font-bold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">High-level analytics across all HypeGrid operations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Campaigns" value={campaigns.length} icon={Megaphone} variant="default" />
        <StatCard title="Completed" value={completedCampaigns} icon={CheckCircle} variant="green" />
        <StatCard title="Avg. Value" value={`R ${avgValue.toLocaleString()}`} icon={BarChart3} variant="cyan" />
        <StatCard title="Revenue" value={`R ${totalRevenue.toLocaleString()}`} icon={DollarSign} variant="green" />
        <StatCard title="Creators" value={creators.length} icon={Users} variant="purple" />
        <StatCard title="Deliverables Done" value={completedDeliverables} icon={FileCheck} variant="cyan" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 border border-border/40">
          <h3 className="text-sm font-semibold mb-4">Campaigns by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,37,60,0.6)" />
              <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#CCFF00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-5 border border-border/40">
          <h3 className="text-sm font-semibold mb-4">Campaigns by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}