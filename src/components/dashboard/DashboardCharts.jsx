import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const COLORS = ["#CCFF00", "#00E5FF", "#334CCC", "#CC33CC", "#E23670", "#94A3B8"];

export default function DashboardCharts({ campaigns, invoices, deliverables }) {
  // Campaigns by status
  const statusCounts = {};
  campaigns.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Campaigns by type
  const typeCounts = {};
  campaigns.forEach(c => {
    if (c.type) typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + "…" : name, value }));

  // Deliverables by status
  const delStatusCounts = {};
  deliverables.forEach(d => {
    delStatusCounts[d.status] = (delStatusCounts[d.status] || 0) + 1;
  });
  const delStatusData = Object.entries(delStatusCounts).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-border/60 text-xs">
          <p className="text-foreground font-medium">{label || payload[0].name}</p>
          <p className="text-primary font-bold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Campaigns by Status */}
      <div className="glass-card rounded-xl p-5 border border-border/40">
        <h3 className="text-sm font-semibold text-foreground mb-4">Campaigns by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-2">
          {statusData.slice(0, 4).map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns by Type */}
      <div className="glass-card rounded-xl p-5 border border-border/40">
        <h3 className="text-sm font-semibold text-foreground mb-4">Campaigns by Type</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={typeData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,37,60,0.6)" />
            <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#CCFF00" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Deliverables Status */}
      <div className="glass-card rounded-xl p-5 border border-border/40">
        <h3 className="text-sm font-semibold text-foreground mb-4">Deliverables Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={delStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {delStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-2">
          {delStatusData.slice(0, 4).map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}