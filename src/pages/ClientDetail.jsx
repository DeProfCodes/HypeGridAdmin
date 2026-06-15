import { useQuery } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, MapPin } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientDetail() {
  const id = window.location.pathname.split("/").pop();

  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: () => hypegrid.entities.Client.list() });
  const { data: campaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: () => hypegrid.entities.Campaign.list() });
  const { data: invoices = [] } = useQuery({ queryKey: ["invoices"], queryFn: () => hypegrid.entities.Invoice.list() });
  const { data: quotes = [] } = useQuery({ queryKey: ["quotes"], queryFn: () => hypegrid.entities.Quote.list() });

  const client = clients.find(c => c.id === id);

  if (!client) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;

  const clientCampaigns = campaigns.filter(c => c.client_name === client.brand_name);
  const clientInvoices = invoices.filter(i => i.client_name === client.brand_name);
  const clientQuotes = quotes.filter(q => q.client_name === client.brand_name);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <Link to="/clients" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      <div className="glass-card rounded-xl p-6 border border-border/40">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-2xl font-bold">{client.brand_name?.[0]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold font-heading">{client.brand_name}</h1>
              <StatusBadge status={client.status} />
            </div>
            <p className="text-sm text-muted-foreground">{client.client_type} • {client.industry || "N/A"}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{client.email}</span>
              {client.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{client.phone}</span>}
              {client.website && <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{client.website}</span>}
              {client.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{client.location}</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Spend</p>
            <p className="text-xl font-bold text-primary">R {(client.total_spend || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-4">
          <DataTable columns={[
            { key: "name", label: "Campaign", render: (r) => <Link to={`/campaigns/${r.id}`} className="font-medium hover:text-primary">{r.name}</Link> },
            { key: "type", label: "Type" }, { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "budget", label: "Budget", render: (r) => r.budget ? `R ${r.budget.toLocaleString()}` : "-" },
          ]} data={clientCampaigns} emptyMessage="No campaigns" />
        </TabsContent>
        <TabsContent value="quotes" className="mt-4">
          <DataTable columns={[
            { key: "quote_number", label: "Quote", render: (r) => <span className="text-primary font-medium">{r.quote_number}</span> },
            { key: "package_name", label: "Package" }, { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]} data={clientQuotes} emptyMessage="No quotes" />
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <DataTable columns={[
            { key: "invoice_number", label: "Invoice", render: (r) => <span className="text-primary font-medium">{r.invoice_number}</span> },
            { key: "amount", label: "Amount", render: (r) => `R ${(r.amount || 0).toLocaleString()}` },
            { key: "paid_amount", label: "Paid", render: (r) => `R ${(r.paid_amount || 0).toLocaleString()}` },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]} data={clientInvoices} emptyMessage="No invoices" />
        </TabsContent>
      </Tabs>
    </div>
  );
}