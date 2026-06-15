import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hypegrid } from "@/api/hypegridClient";
import { Video, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Accepts watch?v=, youtu.be/, embed/ and bare ids.
export function youTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(url) ? url : null;
}

const empty = { title: "", subtitle: "", you_tube_url: "", thumbnail_url: "", cta_text: "", cta_url: "", is_active: true, sort_order: 0 };

export default function FeaturedVideoPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(empty);

  const { data: videos = [] } = useQuery({
    queryKey: ["featuredVideos"],
    queryFn: () => hypegrid.entities.FeaturedVideo.list("sort_order", 50),
  });

  // Default the editor to the first (active) video on load.
  useEffect(() => {
    if (selectedId === null && videos.length) selectVideo(videos[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  const selectVideo = (v) => {
    setSelectedId(v.id);
    setForm({ ...empty, ...v, subtitle: v.subtitle || "", thumbnail_url: v.thumbnail_url || "", cta_text: v.cta_text || "", cta_url: v.cta_url || "", sort_order: v.sort_order ?? 0, is_active: v.is_active ?? true });
  };
  const newVideo = () => { setSelectedId(null); setForm(empty); };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["featuredVideos"] });
  const createMutation = useMutation({ mutationFn: (d) => hypegrid.entities.FeaturedVideo.create(d), onSuccess: (row) => { invalidate(); if (row?.id) setSelectedId(row.id); } });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => hypegrid.entities.FeaturedVideo.update(id, data), onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: (id) => hypegrid.entities.FeaturedVideo.delete(id), onSuccess: () => { invalidate(); newVideo(); } });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = (e) => {
    e.preventDefault();
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    selectedId ? updateMutation.mutate({ id: selectedId, data: payload }) : createMutation.mutate(payload);
  };

  const videoId = youTubeId(form.you_tube_url);
  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Featured Video</h1>
          <p className="text-sm text-muted-foreground">The active, in-date video shows on the homepage. Lowest sort order wins.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={newVideo}><Plus className="w-4 h-4" /> New</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={save} className="space-y-4 bg-card border border-border rounded-xl p-5">
          <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Subtitle</Label><Textarea rows={2} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>YouTube URL</Label><Input value={form.you_tube_url} onChange={(e) => set("you_tube_url", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" required /></div>
          <div className="space-y-1.5"><Label>Thumbnail URL (optional)</Label><Input value={form.thumbnail_url} onChange={(e) => set("thumbnail_url", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>CTA text</Label><Input value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>CTA URL</Label><Input value={form.cta_url} onChange={(e) => set("cta_url", e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} /></div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 mt-6"><Label className="cursor-pointer">Active</Label><Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} /></div>
          </div>
          <div className="flex justify-between pt-2">
            {selectedId
              ? <Button type="button" variant="ghost" className="text-destructive gap-2" onClick={() => deleteMutation.mutate(selectedId)}><Trash2 className="w-4 h-4" /> Delete</Button>
              : <span />}
            <Button type="submit" disabled={saving} className="gap-2 bg-primary text-primary-foreground"><Save className="w-4 h-4" /> {saving ? "Saving..." : selectedId ? "Update" : "Create"}</Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center">
            {videoId
              ? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="Preview" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              : <div className="text-center text-muted-foreground text-sm"><Video className="w-8 h-8 mx-auto mb-2 opacity-50" />Paste a YouTube URL to preview</div>}
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {videos.length === 0 && <p className="p-4 text-sm text-muted-foreground">No featured videos yet.</p>}
            {videos.map((v) => (
              <button key={v.id} type="button" onClick={() => selectVideo(v)}
                className={`w-full text-left p-3 flex items-center justify-between hover:bg-muted/30 ${v.id === selectedId ? "bg-muted/40" : ""}`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                  <p className="text-xs text-muted-foreground">sort {v.sort_order ?? 0}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${v.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{v.is_active ? "Active" : "Inactive"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
