import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/components/ui/use-toast";

// Reusable settings group editor. Loads a group from the store, renders the
// supplied fields, and saves the whole group. Keeps the existing Settings UI
// (Input / Label / Button) — no redesign.
//
// fields: [{ key, label, type?, colSpan?, placeholder? }]
export default function SettingsForm({ group, fields, note }) {
  const fetchGroup = useSettingsStore((s) => s.fetchGroup);
  const saveGroup = useSettingsStore((s) => s.saveGroup);
  const groupData = useSettingsStore((s) => s.groups[group]);
  const loading = useSettingsStore((s) => s.loading[group]);
  const saving = useSettingsStore((s) => s.saving[group]);
  const error = useSettingsStore((s) => s.error[group]);
  const savedAt = useSettingsStore((s) => s.savedAt[group]);

  const [form, setForm] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetchGroup(group);
  }, [fetchGroup, group]);

  // Seed local form from loaded data once (keeps user edits afterwards).
  useEffect(() => {
    if (groupData && !hydrated) {
      const seeded = {};
      fields.forEach((f) => { seeded[f.key] = groupData[f.key] ?? ""; });
      setForm(seeded);
      setHydrated(true);
    }
  }, [groupData, hydrated, fields]);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const ok = await saveGroup(group, form); // form is preserved on failure
    if (ok) {
      toast({ title: "Settings saved", description: "Your changes have been saved." });
    } else {
      toast({ title: "Save failed", description: "Your changes were not saved. Please try again.", variant: "destructive" });
    }
  };

  if (loading && !hydrated) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={`space-y-1.5 ${f.colSpan === "full" ? "col-span-full" : ""}`}>
            <Label>{f.label}</Label>
            <Input
              type={f.type || "text"}
              value={form[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => handleChange(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {note && <p className="text-xs text-muted-foreground">{note}</p>}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>) : "Save Changes"}
        </Button>
        {savedAt && !saving && !error && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-500">
            <Check className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
