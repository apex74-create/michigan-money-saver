import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Zap, Upload, X } from "lucide-react";

const CATEGORIES = [
  "general", "furniture", "electronics", "clothing", "tools",
  "toys", "books", "sports", "automotive", "collectibles", "other"
];

export default function CreateListing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    address: "",
    city: "",
    state: "",
    zip: "",
    saleDate: "",
    saleEndDate: "",
    priceMin: "",
    priceMax: "",
  });
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPhotoMutation = trpc.listings.uploadPhoto.useMutation();

  const createMutation = trpc.listings.create.useMutation({
    onSuccess: async (data) => {
      if (photos.length > 0) {
        setUploading(true);
        for (const photo of photos) {
          try {
            const base64 = await fileToBase64(photo.file);
            await uploadPhotoMutation.mutateAsync({
              listingId: data.id,
              fileName: photo.file.name,
              base64Data: base64,
              contentType: photo.file.type || "image/jpeg",
            });
          } catch (e) { console.error("Photo upload failed:", e); }
        }
        setUploading(false);
      }
      toast.success("Sale posted to the mesh!");
      setLocation(`/listing/${data.id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create listing");
    },
  });

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => { resolve((reader.result as string).split(",")[1]); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 20));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 border border-terminal/20 bg-card p-8 corner-brackets">
            <div className="text-terminal text-sm font-bold tracking-wider">ACCESS REQUIRED</div>
            <p className="text-muted-foreground text-xs">Connect to post a sale on the mesh</p>
            <Button
              onClick={() => startLogin()}
              className="bg-terminal text-background text-[10px] tracking-[0.2em] uppercase"
            >
              ▸ CONNECT NOW
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.address || !form.city || !form.state || !form.zip || !form.saleDate) {
      toast.error("Fill in all required fields");
      return;
    }
    createMutation.mutate({
      title: form.title,
      description: form.description || undefined,
      category: form.category as any,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      saleDate: new Date(form.saleDate).toISOString(),
      saleEndDate: form.saleEndDate ? new Date(form.saleEndDate).toISOString() : undefined,
      priceMin: form.priceMin ? parseFloat(form.priceMin) : undefined,
      priceMax: form.priceMax ? parseFloat(form.priceMax) : undefined,
    });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-foreground">POST A SALE</h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
              ONE BUTTON — YOUR SALE GOES LIVE ON THE MESH
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 border border-border bg-card p-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] text-brass uppercase">SALE TITLE *</label>
              <Input
                placeholder="Saturday Morning Garage Sale"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="bg-background border-terminal/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] text-brass uppercase">DESCRIPTION</label>
              <Textarea
                placeholder="What are you selling? Give buyers a reason to show up..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="bg-background border-terminal/20 min-h-[100px]"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] text-brass uppercase">CATEGORY *</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full bg-background border border-terminal/20 text-foreground text-sm px-3 py-2 uppercase tracking-wider"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">ADDRESS *</label>
                <Input
                  placeholder="123 Main Street"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">CITY *</label>
                <Input
                  placeholder="Detroit"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-brass uppercase">STATE *</label>
                  <Input
                    placeholder="MI"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="bg-background border-terminal/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] text-brass uppercase">ZIP *</label>
                  <Input
                    placeholder="48201"
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="bg-background border-terminal/20"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">SALE DATE *</label>
                <Input
                  type="datetime-local"
                  value={form.saleDate}
                  onChange={(e) => updateField("saleDate", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">END DATE</label>
                <Input
                  type="datetime-local"
                  value={form.saleEndDate}
                  onChange={(e) => updateField("saleEndDate", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">PRICE MIN ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1.00"
                  value={form.priceMin}
                  onChange={(e) => updateField("priceMin", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] text-brass uppercase">PRICE MAX ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="500.00"
                  value={form.priceMax}
                  onChange={(e) => updateField("priceMax", e.target.value)}
                  className="bg-background border-terminal/20"
                />
              </div>
            </div>

            {/* Photo Upload Placeholder */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] text-brass uppercase">PHOTOS</label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative border border-terminal/20 aspect-square">
                      <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-classified text-white flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-terminal/30 bg-background p-8 text-center cursor-pointer hover:border-terminal/60 transition-colors">
                <Upload size={24} className="text-terminal/40 mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground tracking-wider">
                  {photos.length > 0 ? `${photos.length} photo(s) selected — click to add more` : "Click to select photos (up to 20)"}
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={createMutation.isPending || uploading}
              className="w-full bg-terminal text-background hover:bg-terminal/90 text-[11px] tracking-[0.2em] uppercase py-3"
            >
              <Zap size={14} className="mr-2" />
              {uploading ? "UPLOADING PHOTOS..." : createMutation.isPending ? "POSTING TO MESH..." : "POST SALE — GO LIVE"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
