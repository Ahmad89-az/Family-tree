import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

const MAX_DIMENSION = 400; // px
const JPEG_QUALITY = 0.8;

/** Resize + compress an image file, returning a base64 data URL. */
function fileToResizedBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Lets the user either type an image URL or upload a photo from their device.
 * Uploaded photos are resized/compressed client-side and stored as base64 —
 * no external hosting (Imgur/Drive/etc.) required.
 */
export default function PhotoUploadField({ value, onChange, seed }) {
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isUploaded = value?.startsWith('data:image');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (jpg, png, dll).');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const base64 = await fileToResizedBase64(file);
      onChange(base64);
    } catch (err) {
      setError(err.message || 'Gagal memproses gambar.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <img
          src={value || `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed || 'preview')}&backgroundColor=e2e8f0`}
          alt="Pratinjau"
          className="h-14 w-14 flex-shrink-0 rounded-xl border border-[var(--color-border)] object-cover dark:border-slate-700"
        />

        {isUploaded ? (
          <div className="flex flex-1 items-center justify-between rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            <span className="text-slate-600 dark:text-slate-300">Foto sudah diupload dari perangkat</span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-slate-400 hover:text-red-500"
              aria-label="Hapus foto"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tempel URL foto, atau upload di bawah"
            className="w-full flex-1 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        )}
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {busy ? 'Memproses...' : 'Upload foto dari perangkat'}
        </button>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}