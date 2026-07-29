import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  LocateFixed,
  Maximize,
  Minimize,
  Filter,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { useFamilyData } from '../context/FamilyDataContext';
import { geocodeAddresses } from '../utils/geocode';
import { getAllGenerations } from '../utils/familyUtils';

const DEFAULT_CENTER = [-2.5, 118];
const DEFAULT_ZOOM = 5;

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
  esriNatGeo: {
    label: 'Esri NatGeo',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, National Geographic',
      },
    ],
  },
  esriImagery: {
    label: 'Esri Imagery',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri',
      },
    ],
  },
};

const DEFAULT_FILTERS = { generation: 'all', status: 'all', gender: 'all', province: 'all' };

export default function MapPage() {
  const { members } = useFamilyData();
  const [locations, setLocations] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [basemap, setBasemap] = useState('osm');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const filterWrapRef = useRef(null);
  const infoWrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setFilterOpen(false);
      if (infoWrapRef.current && !infoWrapRef.current.contains(e.target)) setInfoOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const membersWithAddress = useMemo(
    () => members.filter((m) => m.address && m.address.trim()),
    [members]
  );

  const generationMap = useMemo(() => {
    const map = {};
    const gens = getAllGenerations(members);
    Object.entries(gens).forEach(([gen, people]) => {
      people.forEach((p) => {
        map[p.id] = Number(gen);
      });
    });
    return map;
  }, [members]);

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

  const generationOptions = useMemo(() => {
    const set = new Set(membersWithAddress.map((m) => generationMap[m.id]).filter((g) => g != null));
    return [...set].sort((a, b) => a - b);
  }, [membersWithAddress, generationMap]);

  const provinceOptions = useMemo(() => {
    if (!locations) return [];
    const set = new Set();
    membersWithAddress.forEach((m) => {
      const loc = locations.get(m.address.trim());
      if (loc?.province) set.add(loc.province);
    });
    return [...set].sort();
  }, [locations, membersWithAddress]);

  const filteredMembers = useMemo(() => {
    return membersWithAddress.filter((m) => {
      if (filters.generation !== 'all' && generationMap[m.id] !== Number(filters.generation)) return false;
      if (filters.status === 'alive' && m.deathDate) return false;
      if (filters.status === 'deceased' && !m.deathDate) return false;
      if (filters.gender !== 'all' && m.gender !== filters.gender) return false;
      if (filters.province !== 'all') {
        const loc = locations?.get(m.address.trim());
        const prov = loc?.province || 'Tidak diketahui';
        if (prov !== filters.province) return false;
      }
      return true;
    });
  }, [membersWithAddress, filters, generationMap, locations]);

  const grouped = useMemo(() => {
    if (!locations) return [];
    const map = new Map();
    filteredMembers.forEach((m) => {
      const loc = locations.get(m.address.trim());
      if (!loc) return;
      const key = `${loc.lat.toFixed(3)},${loc.lng.toFixed(3)}`;
      if (!map.has(key)) map.set(key, { lat: loc.lat, lng: loc.lng, address: m.address, members: [] });
      map.get(key).members.push(m);
    });
    return [...map.values()];
  }, [locations, filteredMembers]);

  const mappedCount = useMemo(() => {
    if (!locations) return 0;
    return filteredMembers.filter((m) => locations.get(m.address.trim())).length;
  }, [locations, filteredMembers]);

  const notFoundCount = useMemo(() => {
    if (!locations) return 0;
    return membersWithAddress.filter((m) => locations.get(m.address.trim()) === null).length;
  }, [locations, membersWithAddress]);

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const resetView = () => {
    mapRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  };

  const basemapKeys = Object.keys(BASEMAPS);
  const cycleBasemap = () => {
    setBasemap((prev) => {
      const idx = basemapKeys.indexOf(prev);
      return basemapKeys[(idx + 1) % basemapKeys.length];
    });
  };

  if (!locations) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#0F172A]" />
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
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-4rem)]'}`}
    >
      <MapContainer
        ref={mapRef}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
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

      {/* Toolbar horizontal — pojok kanan atas */}
      <div className="absolute right-4 top-4 z-[1000] flex items-center gap-0.5 rounded-full border border-[var(--color-border)] bg-white p-1 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <ToolbarBtn label="Perkecil" onClick={() => mapRef.current?.zoomOut()}>
          <Minus size={15} />
        </ToolbarBtn>
        <ToolbarBtn label="Perbesar" onClick={() => mapRef.current?.zoomIn()}>
          <Plus size={15} />
        </ToolbarBtn>

        <Divider />

        <div ref={infoWrapRef} className="relative">
          <ToolbarBtn
            label="Info lokasi"
            active={infoOpen}
            onClick={() => { setInfoOpen((o) => !o); setFilterOpen(false); }}
          >
            <MapPin size={15} />
          </ToolbarBtn>
          {infoOpen && (
            <div className="absolute left-10/10 -translate-x-4/10 top-full mt-2 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {grouped.length} lokasi &middot; {mappedCount} anggota terpetakan
            </div>
          )}
        </div>

        <Divider />

        <ToolbarBtn label={`Gaya peta: ${BASEMAPS[basemap].label} (klik buat ganti)`} onClick={cycleBasemap}>
          <Layers size={15} />
        </ToolbarBtn>

        <ToolbarBtn label="Reset tampilan" onClick={resetView}>
          <LocateFixed size={15} />
        </ToolbarBtn>

        <ToolbarBtn label="Layar penuh" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </ToolbarBtn>

        <div ref={filterWrapRef} className="relative">
          <ToolbarBtn
            label="Filter"
            active={filterOpen || isFiltered}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <Filter size={15} />
          </ToolbarBtn>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-white p-4 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Filter</p>

              <FilterSelect
                label="Generasi"
                value={filters.generation}
                onChange={(v) => setFilters((f) => ({ ...f, generation: v }))}
                options={[
                  { value: 'all', label: 'Semua' },
                  ...generationOptions.map((g) => ({ value: String(g), label: `Generasi ${g}` })),
                ]}
              />
              <FilterSelect
                label="Status"
                value={filters.status}
                onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                options={[
                  { value: 'all', label: 'Semua' },
                  { value: 'alive', label: 'Masih Hidup' },
                  { value: 'deceased', label: 'Almarhum/Almarhumah' },
                ]}
              />
              <FilterSelect
                label="Jenis Kelamin"
                value={filters.gender}
                onChange={(v) => setFilters((f) => ({ ...f, gender: v }))}
                options={[
                  { value: 'all', label: 'Semua' },
                  { value: 'Male', label: 'Laki-laki' },
                  { value: 'Female', label: 'Perempuan' },
                ]}
              />
              <FilterSelect
                label="Provinsi"
                value={filters.province}
                onChange={(v) => setFilters((f) => ({ ...f, province: v }))}
                options={[
                  { value: 'all', label: 'Semua' },
                  ...provinceOptions.map((p) => ({ value: p, label: p })),
                ]}
              />

              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RotateCcw size={12} /> Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {notFoundCount > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] max-w-xs rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {notFoundCount} anggota alamatnya belum bisa ditemukan titik lokasinya (coba tulis alamat yang lebih jelas, mis. sertakan nama kota/kabupaten).
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({ onClick, label, active, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A]'
          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px bg-[var(--color-border)] dark:bg-slate-700" />;
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm text-[#0F172A] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}