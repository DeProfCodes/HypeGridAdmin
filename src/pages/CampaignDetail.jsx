import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Users, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";

export default function CampaignDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = window.location.pathname.split("/").pop();

  const queryClient = useQueryClient();

  const { data: campaigns = [] } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => hypegrid.entities.Campaign.list(),
  });

  const campaign = campaigns.find(c => c.id === id);

  const { data: deliverables = [] } = useQuery({
    queryKey: ["deliverables"],
    queryFn: () => hypegrid.entities.Deliverable.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => hypegrid.entities.Task.list(),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => hypegrid.entities.Invoice.list(),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => hypegrid.entities.Note.list("-created_date", 50),
  });

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const campaignDeliverables = deliverables.filter(d => d.campaign_name === campaign.name);
  const campaignTasks = tasks.filter(t => t.campaign_name === campaign.name);
  const campaignInvoices = invoices.filter(i => i.campaign_name === campaign.name);
  const campaignNotes = notes.filter(n => n.entity_name === campaign.name);

  const phases = ["Request Received", "Quote Sent", "Payment Confirmed", "Strategy / Planning", "Content Creation", "Creator Activation", "Campaign Live", "Reporting", "Completed"];
  const currentPhaseIdx = phases.indexOf(campaign.phase || "Request Received");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Back + Header */}
      <div>
        <Link to="/campaigns" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading">{campaign.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground">{campaign.client_name}</span>
              <StatusBadge status={campaign.status} />
              <span className="text-xs text-muted-foreground">{campaign.type}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="glass-card rounded-lg px-4 py-2 border border-border/40 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">R {(campaign.budget || 0).toLocaleString()}</span>
            </div>
            <div className="glass-card rounded-lg px-4 py-2 border border-border/40 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-xs">{campaign.start_date || "N/A"} — {campaign.end_date || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass-card rounded-xl p-5 border border-border/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Campaign Progress</span>
          <span className="text-sm font-bold text-primary">{campaign.progress || 0}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${campaign.progress || 0}%` }} />
        </div>
        <div className="flex justify-between mt-3 overflow-x-auto gap-1">
          {phases.map((phase, i) => (
            <div key={phase} className="flex flex-col items-center min-w-[80px]">
              <div className={`w-3 h-3 rounded-full ${i <= currentPhaseIdx ? "bg-primary" : "bg-muted"}`} />
              <span className={`text-[9px] mt-1 text-center ${i <= currentPhaseIdx ? "text-primary" : "text-muted-foreground"}`}>{phase}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/30 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5 border border-border/40 space-y-3">
              <h3 className="font-semibold text-sm">Campaign Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Objective:</span> <span>{campaign.objective || "Not set"}</span></div>
                <div><span className="text-muted-foreground">Target Audience:</span> <span>{campaign.target_audience || "Not set"}</span></div>
                <div><span className="text-muted-foreground">Manager:</span> <span>{campaign.manager || "Unassigned"}</span></div>
                <div><span className="text-muted-foreground">Phase:</span> <span className="text-primary">{campaign.phase || "Request Received"}</span></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 border border-border/40 space-y-3">
              <h3 className="font-semibold text-sm">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold text-primary">{campaignDeliverables.length}</p>
                  <p className="text-xs text-muted-foreground">Deliverables</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold text-accent">{campaignTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold">{campaignInvoices.length}</p>
                  <p className="text-xs text-muted-foreground">Invoices</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-2xl font-bold">{campaignNotes.length}</p>
                  <p className="text-xs text-muted-foreground">Notes</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <DataTable
            columns={[
              { key: "title", label: "Task", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "assigned_to", label: "Assigned To" },
              { key: "due_date", label: "Due", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
              { key: "priority", label: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            data={campaignTasks}
            emptyMessage="No tasks for this campaign"
          />
        </TabsContent>

        <TabsContent value="deliverables" className="mt-4">
          <DataTable
            columns={[
              { key: "title", label: "Deliverable", render: (r) => <span className="font-medium">{r.title}</span> },
              { key: "creator_name", label: "Creator" },
              { key: "type", label: "Type" },
              { key: "platform", label: "Platform" },
              { key: "due_date", label: "Due", render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "-" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            data={campaignDeliverables}
            emptyMessage="No deliverables for this campaign"
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <DataTable
            columns={[
              { key: "invoice_number", label: "Invoice", render: (r) => <span className="font-medium text-primary">{r.invoice_number}</span> },
              { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
              { key: "paid_amount", label: "Paid", render: (r) => `R ${(r.paid_amount || 0).toLocaleString()}` },
              { key: "outstanding", label: "Outstanding", render: (r) => `R ${(r.outstanding || 0).toLocaleString()}` },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            data={campaignInvoices}
            emptyMessage="No invoices for this campaign"
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-3">
          {campaignNotes.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notes for this campaign</p>}
          {campaignNotes.map(note => (
            <div key={note.id} className="glass-card rounded-xl p-4 border border-border/40">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{note.author}</span>
                <span className="text-xs text-muted-foreground">{new Date(note.created_date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-foreground/90">{note.content}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}