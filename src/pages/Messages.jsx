import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/StatusBadge";

export default function Messages() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ content: "", entity_type: "Internal", entity_name: "", visibility: "Internal", author: "Admin" });
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => hypegrid.entities.Note.list("-created_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (d) => hypegrid.entities.Note.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notes"] }); setShowForm(false); setForm({ content: "", entity_type: "Internal", entity_name: "", visibility: "Internal", author: "Admin" }); },
  });

  const filtered = tab === "all" ? notes : notes.filter(n => n.entity_type === tab);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Messages & Notes</h1>
          <p className="text-sm text-muted-foreground">Internal and client-facing communication.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Note
        </Button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-5 border border-border/40 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label>Type</Label>
              <Select value={form.entity_type} onValueChange={(v) => setForm({ ...form, entity_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Campaign", "Client", "Creator", "Internal"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Related To</Label><Input value={form.entity_name} onChange={(e) => setForm({ ...form, entity_name: e.target.value })} placeholder="Campaign/client name" /></div>
            <div className="space-y-1.5"><Label>Visibility</Label>
              <Select value={form.visibility} onValueChange={(v) => setForm({ ...form, visibility: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="Client-facing">Client-facing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Note</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} placeholder="Write your note..." /></div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.content} className="bg-primary text-primary-foreground">
              {createMutation.isPending ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Campaign">Campaign</TabsTrigger>
          <TabsTrigger value="Client">Client</TabsTrigger>
          <TabsTrigger value="Creator">Creator</TabsTrigger>
          <TabsTrigger value="Internal">Internal</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-xl p-10 text-center border border-border/40">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No notes yet</p>
          </div>
        )}
        {filtered.map(note => (
          <div key={note.id} className="glass-card rounded-xl p-4 border border-border/40">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{note.author || "Unknown"}</span>
                <StatusBadge status={note.entity_type} />
                {note.visibility === "Client-facing" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">Client-facing</span>}
              </div>
              <span className="text-xs text-muted-foreground">{new Date(note.created_date).toLocaleDateString()}</span>
            </div>
            {note.entity_name && <p className="text-xs text-muted-foreground mb-1">Re: {note.entity_name}</p>}
            <p className="text-sm text-foreground/90">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}