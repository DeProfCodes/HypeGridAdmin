import { useQuery } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Instagram } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreatorDetail() {
  const id = window.location.pathname.split("/").pop();

  const { data: creators = [] } = useQuery({ queryKey: ["creators"], queryFn: () => hypegrid.entities.Creator.list() });
  const { data: deliverables = [] } = useQuery({ queryKey: ["deliverables"], queryFn: () => hypegrid.entities.Deliverable.list() });
  const { data: payouts = [] } = useQuery({ queryKey: ["payouts"], queryFn: () => hypegrid.entities.Payout.list() });

  const creator = creators.find(c => c.id === id);

  if (!creator) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;

  const creatorDeliverables = deliverables.filter(d => d.creator_name === creator.full_name);
  const creatorPayouts = payouts.filter(p => p.creator_name === creator.full_name);
  const totalEarned = creatorPayouts.reduce((s, p) => s + (p.amount || 0), 0);
  const totalPaid = creatorPayouts.filter(p => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <Link to="/creators" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Creators
      </Link>

      <div className="glass-card rounded-xl p-6 border border-border/40">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/40 to-primary/40 flex items-center justify-center text-2xl font-bold">{creator.full_name?.[0]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold font-heading">{creator.full_name}</h1>
              <StatusBadge status={creator.status} />
            </div>
            <p className="text-sm text-accent font-medium">@{creator.handle} • {creator.platform} • {creator.niche}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{creator.email}</span>
              {creator.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{creator.phone}</span>}
              {creator.city && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{creator.city}, {creator.province}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{creator.followers?.toLocaleString() || 0} followers</p>
            {creator.bio && <p className="text-sm mt-3 text-foreground/80">{creator.bio}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="glass-card rounded-lg p-3 border border-border/40">
              <p className="text-lg font-bold text-primary">R {totalEarned.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
            <div className="glass-card rounded-lg p-3 border border-border/40">
              <p className="text-lg font-bold text-emerald-400">R {totalPaid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Paid Out</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="deliverables">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        <TabsContent value="deliverables" className="mt-4">
          <DataTable columns={[
            { key: "title", label: "Deliverable", render: (r) => <span className="font-medium">{r.title}</span> },
            { key: "campaign_name", label: "Campaign" }, { key: "type", label: "Type" }, { key: "platform", label: "Platform" },
            { key: "due_date", label: "Due", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]} data={creatorDeliverables} emptyMessage="No deliverables" />
        </TabsContent>
        <TabsContent value="earnings" className="mt-4">
          <DataTable columns={[
            { key: "campaign_name", label: "Campaign" }, { key: "deliverable", label: "Deliverable" },
            { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "paid_date", label: "Paid", render: (r) => r.paid_date ? new Date(r.paid_date).toLocaleDateString() : "-" },
          ]} data={creatorPayouts} emptyMessage="No payouts" />
        </TabsContent>
      </Tabs>
    </div>
  );
}