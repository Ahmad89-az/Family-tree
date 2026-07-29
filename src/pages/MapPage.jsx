import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2 } from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { geocodeAddresses } from '../utils/geocode';

// Beberapa pilihan gaya peta dasar buat dibandingkan — tinggal klik tombolnya
// di pojok kanan atas peta buat ganti-ganti tanpa perlu ubah kode.
const BASEMAPS = {
  osm: {
    label: 'OpenStreetMap',
    layers: [
      {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors',
      },
    ],
  },
  esriImagery: {
    label: 'Esri Imagery',
    layers: [
      {
        // Citra satelit asli — cocok buat lihat "wujud asli" daerah tempat
        // anggota keluarga tinggal.
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri',
      },
    ],
  },
  esriNatGeo: {
    label: 'Esri NatGeo',
    layers: [
      {
        // Gaya khas National Geographic — warna alami, lebih artistik.
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, National Geographic',
      },
    ],
  },
};

export default function MapPage() {
  const { members } = useFamilyData();
  const [locations, setLocations] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [basemap, setBasemap] = useState('osm');

  const membersWithAddress = useMemo(
    () => members.filter((m) => m.address && m.address.trim()),
    [members]
  );

  useEffect(() => {
    let cancelled = false;
    setLocations(null);
    async function run() {
      const addresses = membersWithAddress.map((m) => m.address);
      const results = await geocodeAddresses(addresses, (done, total) => {
        if (!cancelled) setProgress({ done, total });
      });
      if (!cancelled) setLocations(results);
    }
    if (membersWithAddress.length > 0) {
      run();
    } else {
      setLocations(new Map());
    }
    return () => {
      cancelled = true;
    };
  }, [membersWithAddress]);

  const grouped = useMemo(() => {
    if (!locations) return [];
    const map = new Map();
    membersWithAddress.forEach((m) => {
      const loc = locations.get(m.address.trim());
      if (!loc) return;
      const key = `${loc.lat.toFixed(3)},${loc.lng.toFixed(3)}`;
      if (!map.has(key)) map.set(key, { lat: loc.lat, lng: loc.lng, address: m.address, members: [] });
      map.get(key).members.push(m);
    });
    return [...map.values()];
  }, [locations, membersWithAddress]);

  const notFoundCount = useMemo(() => {
    if (!locations) return 0;
    return membersWithAddress.filter((m) => locations.get(m.address.trim()) === null).length;
  }, [locations, membersWithAddress]);

  if (!locations) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={28} className="animate-spin" />
        <p className="text-sm">
          Mencari titik lokasi dari alamat... ({progress.done}/{progress.total})
        </p>
        <p className="max-w-xs text-center text-xs text-slate-400">
          Ini cuma perlu dilakukan sekali per alamat — hasilnya disimpan supaya lain kali lebih cepat.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: '100%', width: '100%' }}>
        {BASEMAPS[basemap].layers.map((layer, i) => (
          <TileLayer key={`${basemap}-${i}`} url={layer.url} attribution={layer.attribution} />
        ))}
        {grouped.map((g, i) => (
          <CircleMarker
            key={i}
            center={[g.lat, g.lng]}
            radius={8 + Math.min(g.members.length * 2, 20)}
            pathOptions={{ color: '#0F172A', weight: 2, fillColor: '#334155', fillOpacity: 0.65 }}
          >
            <Popup>
              <div className="text-sm">
                <p className="mb-1 font-semibold text-[#0F172A]">{g.address}</p>
                <ul className="space-y-0.5">
                  {g.members.map((m) => (
                    <li key={m.id} className="text-slate-600">{m.name}</li>
                  ))}
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute left-4 top-4 z-[1000] flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <MapPin size={14} /> {grouped.length} lokasi &middot; {membersWithAddress.length - notFoundCount} anggota terpetakan
      </div>

      <div className="absolute right-4 top-4 z-[1000] flex gap-1 rounded-lg border border-[var(--color-border)] bg-white p-1 text-xs shadow-md dark:border-slate-700 dark:bg-slate-800">
        {Object.entries(BASEMAPS).map(([key, bm]) => (
          <button
            key={key}
            onClick={() => setBasemap(key)}
            className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
              basemap === key
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A]'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {bm.label}
          </button>
        ))}
      </div>

      {notFoundCount > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {notFoundCount} anggota alamatnya belum bisa ditemukan titik lokasinya (coba tulis alamat yang lebih jelas, mis. sertakan nama kota/kabupaten).
        </div>
      )}
    </div>
  );
}