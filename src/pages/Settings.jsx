import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Building2, Megaphone, Package, CreditCard, Palette, Mail } from "lucide-react";
import SettingsForm from "@/components/settings/SettingsForm";

function SettingSection({ title, icon: Icon, children }) {
  return (
    <div className="glass-card rounded-xl border border-border/40 p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10"><Icon className="w-4 h-4 text-primary" /></div>
        <h3 className="font-semibold font-heading">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Editable groups are backed by GET/PUT /api/admin/settings/{group} (live) or
// the settings mock (demo). Field key == backend SiteSetting key.
const COMPANY_FIELDS = [
  { key: "company_name", label: "Company Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address", colSpan: "full" },
  // TODO: social links + logo/branding have no UI field yet — add here when the design includes them.
];

const COMMUNICATION_FIELDS = [
  { key: "support_email", label: "Support Email", type: "email" },
  { key: "noreply_email", label: "No-Reply Email", type: "email" },
  { key: "campaigns_email", label: "Campaigns Email", type: "email" },
  { key: "creators_email", label: "Creators Email", type: "email" },
  { key: "notification_email", label: "Lead Notification Recipient", type: "email", colSpan: "full" },
];

const FINANCE_FIELDS = [
  { key: "invoice_prefix", label: "Invoice Prefix" },
  { key: "quote_prefix", label: "Quote Prefix" },
  { key: "tax_rate", label: "Tax Rate (%)" },
  { key: "currency", label: "Currency" },
];

export default function Settings() {
  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your HypeGrid portal configuration.</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <SettingSection title="Company Settings" icon={Building2}>
            <SettingsForm group="company" fields={COMPANY_FIELDS} />
          </SettingSection>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <SettingSection title="Communication Settings" icon={Mail}>
            <SettingsForm
              group="communication"
              fields={COMMUNICATION_FIELDS}
              note="These addresses are stored for reference and lead-notification routing. The live email sender accounts (SMTP host/credentials) are configured per environment in the backend app settings."
            />
          </SettingSection>
        </TabsContent>

        {/* Read-only reference — no backend settings group for these yet (TODO). */}
        <TabsContent value="campaigns" className="mt-6">
          <SettingSection title="Campaign Settings" icon={Megaphone}>
            <p className="text-sm text-muted-foreground">Configure default campaign statuses, task statuses, deliverable types, and platforms.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Default Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Instagram", "TikTok", "Facebook", "YouTube", "WhatsApp"].map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/40">{p}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deliverable Types</Label>
                <div className="flex flex-wrap gap-2">
                  {["Reel", "TikTok Video", "Instagram Post", "Story", "Flyer", "Caption"].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/40">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </SettingSection>
        </TabsContent>

        {/* Read-only reference — packages are managed via the public-content endpoints (TODO: wire to /api/admin/content/packages). */}
        <TabsContent value="packages" className="mt-6">
          <SettingSection title="Package Settings" icon={Package}>
            <div className="space-y-3">
              {[
                { name: "Starter Hype", price: "R 2,500" },
                { name: "Growth Hype", price: "R 5,000" },
                { name: "Premium Launch", price: "R 12,000" },
                { name: "Monthly Brand Management", price: "R 8,500/mo" },
                { name: "Music Release Push", price: "R 6,000" },
                { name: "Custom Campaign", price: "Custom" },
              ].map(pkg => (
                <div key={pkg.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20">
                  <span className="text-sm font-medium">{pkg.name}</span>
                  <span className="text-sm text-primary font-semibold">{pkg.price}</span>
                </div>
              ))}
            </div>
          </SettingSection>
        </TabsContent>

        <TabsContent value="finance" className="mt-6">
          <SettingSection title="Finance Settings" icon={CreditCard}>
            <SettingsForm group="finance" fields={FINANCE_FIELDS} />
          </SettingSection>
        </TabsContent>

        {/* Read-only reference — theme/portal preferences are not persisted yet (TODO). */}
        <TabsContent value="portal" className="mt-6">
          <SettingSection title="Portal Settings" icon={Palette}>
            <p className="text-sm text-muted-foreground">Theme, notifications, and permission settings are managed here.</p>
            <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/20">
              <p className="text-sm font-medium">Current Theme: <span className="text-primary">HypeGrid Dark</span></p>
            </div>
          </SettingSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
