"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  Trash2, 
  Loader2, 
  Plus, 
  Lock,
  Package,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminNewProductPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  // Form Input States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Street Lamps");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // File Upload States
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);

  // Check admin role
  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin]);

  // Main Image Change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Secondary Images Addition
  const handleSecondaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSecondaryFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSecondaryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Remove newly uploaded secondary image preview
  const removeNewSecondaryImage = (index: number) => {
    setSecondaryFiles(prev => prev.filter((_, i) => i !== index));
    setSecondaryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Upload helper
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Submit Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !stock) return;

    try {
      setSaving(true);
      const stockVal = parseInt(stock);

      if (isNaN(stockVal) || stockVal < 0) throw new Error("Please enter a valid stock level.");

      // 1. Upload main image if present
      let finalMainImageUrl = imageUrl;
      if (mainImageFile) {
        finalMainImageUrl = await uploadFileToStorage(mainImageFile);
      }

      // 2. Upload any new secondary images
      const secondaryUrls: string[] = [];
      if (secondaryFiles.length > 0) {
        for (const file of secondaryFiles) {
          const url = await uploadFileToStorage(file);
          secondaryUrls.push(url);
        }
      }

      const productPayload = {
        name: name.trim(),
        category,
        stock_quantity: stockVal,
        image: finalMainImageUrl,
        images: secondaryUrls,
        description: description.trim()
      };

      const { error: insertError } = await supabase
        .from("products")
        .insert([productPayload]);

      if (insertError) throw insertError;

      alert("Product created successfully!");
      router.push("/admin");
    } catch (err: any) {
      console.error("Failed to create product:", err);
      alert(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="max-w-md w-full bg-background p-8 rounded-2xl shadow-xl border text-center space-y-6">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Lock className="text-primary h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Admin Portal</h2>
        <p className="text-muted-foreground">Please sign in to access the management dashboard.</p>
        <Button asChild className="w-full">
          <Link href="/login?redirect=/admin/products/new">Sign In</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Add New Product</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Discard</Link>
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Product
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold border-b pb-4">Product Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Skyline Boulevard Street Lamp" />
                </div>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-background border rounded-md h-9 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="Street Lamps">Street Lamps</option>
                      <option value="Landscape Lamps">Landscape Lamps</option>
                      <option value="Ceiling Lights">Ceiling Lights</option>
                      <option value="Wall Sconces">Wall Sconces</option>
                      <option value="Pendant Lamps">Pendant Lamps</option>
                      <option value="Industrial Lighting">Industrial Lighting</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Initial Stock *</Label>
                    <Input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">External Image URL (Optional)</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={6} placeholder="Detailed product specifications and features..." />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Media */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold border-b pb-4">Media Management</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <div className="relative aspect-square rounded-2xl bg-muted border border-dashed flex flex-col items-center justify-center overflow-hidden group">
                    {mainImagePreview ? (
                      <>
                        <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover" />
                        <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white" onClick={() => {setMainImageFile(null); setMainImagePreview("");}}>
                          <Trash2 className="h-6 w-6" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Click or drag to upload primary image</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMainImageChange} />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Gallery Images</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {secondaryPreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl bg-muted overflow-hidden group border">
                        <img src={src} className="w-full h-full object-cover" />
                        <button className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all" onClick={() => removeNewSecondaryImage(idx)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="relative aspect-square rounded-xl bg-muted border border-dashed flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleSecondaryImagesChange} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
