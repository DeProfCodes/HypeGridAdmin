import { useRef, useState } from "react";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { assetsApi } from "@/api/assetsApi";
import { STORE_CONFIG } from "@/stores/config";

/**
 * Image field that keeps the manual URL input AND adds an upload button.
 * On a successful upload the returned public URL is written back via onChange.
 * Falls back gracefully: in demo/mock mode (no backend) it prompts for a URL,
 * and any upload error is shown inline without losing the typed URL.
 *
 * Props: label, value, onChange(url), category (backend category key),
 *        recommended (e.g. "1920×1080").
 */
export default function ImageUploadField({ label, value, onChange, category, recommended }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = () => { setError(""); inputRef.current?.click(); };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (STORE_CONFIG.getMockMode()) {
      setError("Uploads need a live login. In demo mode, paste an image URL instead.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const res = await assetsApi.upload(file, category);
      if (res?.url) onChange(res.url);
      else setError("Upload did not return a URL.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}{recommended && <span className="text-muted-foreground font-normal"> · {recommended}</span>}</Label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
            <X className="w-3 h-3" /> clear
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://assets.hypegrid.co.za/… or upload →"
        />
        <Button type="button" variant="outline" onClick={pick} disabled={uploading} className="shrink-0 gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading" : "Upload"}
        </Button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {value && (
        <div className="mt-2 relative w-full max-w-[220px] rounded-lg overflow-hidden border border-border/50 bg-muted/30">
          <img
            src={value}
            alt={label ? `${label} preview` : "Image preview"}
            loading="lazy"
            className="w-full h-28 object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <div className="hidden h-28 items-center justify-center text-muted-foreground text-xs gap-1">
            <ImageIcon className="w-4 h-4" /> Image not loading
          </div>
        </div>
      )}
    </div>
  );
}
