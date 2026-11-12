'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Upload, Star } from 'lucide-react';

export interface UploadedImage {
  url: string;
  is_cover?: boolean;
}

export default function ImageUploader({
  images,
  onChange,
  propertyId,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  propertyId?: string;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${propertyId || 'draft'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('property-media').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('property-media').getPublicUrl(path);
        newImages.push({ url: data.publicUrl });
      }
    }

    onChange([...images, ...newImages]);
    setUploading(false);
  }

  return (
    <div>
      <label className="text-sm font-medium text-charcoal-700 mb-2 block">
        Property Images (unlimited)
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, idx) => (
          <div key={img.url} className="relative aspect-square rounded-lg overflow-hidden border border-charcoal-200 group">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.map((i, ix) => ix === idx ? { ...i, is_cover: true } : { ...i, is_cover: false }))}
              className="absolute top-1 left-1 bg-white/90 rounded-full p-1"
              title="Set as cover"
            >
              <Star size={12} className={img.is_cover ? 'fill-gold-500 text-gold-500' : 'text-charcoal-500'} />
            </button>
            <button
              type="button"
              onClick={() => onChange(images.filter((_, ix) => ix !== idx))}
              className="absolute top-1 right-1 bg-white/90 rounded-full p-1"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-charcoal-300 rounded-lg py-6 cursor-pointer hover:border-gold-500 text-sm text-charcoal-500">
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Click to upload images (multiple allowed)'}
        <input type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
      </label>
    </div>
  );
}
