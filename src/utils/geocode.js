// Ubah teks alamat jadi koordinat (lintang/bujur) pakai layanan gratis
// OpenStreetMap Nominatim, dengan cache di localStorage supaya alamat yang
// sama tidak dicari berulang-ulang setiap halaman peta dibuka.

const CACHE_PREFIX = 'geocode:';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

function normalize(address) {
  return address.trim().toLowerCase();
}

function getCached(address) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + normalize(address));
    return raw !== null ? JSON.parse(raw) : undefined; // undefined = belum pernah dicari
  } catch {
    return undefined;
  }
}

function setCached(address, value) {
  try {
    localStorage.setItem(CACHE_PREFIX + normalize(address), JSON.stringify(value));
  } catch {
    // localStorage penuh/diblokir — abaikan, cache jadi tidak tersimpan tapi tidak fatal
  }
}

async function geocodeOne(address) {
  const cached = getCached(address);
  if (cached !== undefined) return cached; // bisa berupa {lat,lng} ATAU null (memang tidak ketemu)

  try {
    const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=id&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data?.[0]
      ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      : null;
    setCached(address, result);
    return result;
  } catch {
    return null; // gagal (offline/error) — jangan simpan ke cache, coba lagi lain kali
  }
}

/**
 * Geocode banyak alamat sekaligus, satu per satu dengan jeda ~1.1 detik
 * antar panggilan ke layanan luar (mengikuti kebijakan pemakaian wajar
 * Nominatim). Alamat yang sudah ada di cache tidak perlu menunggu jeda.
 * Mengembalikan Map: alamat asli -> {lat,lng} | null.
 */
export async function geocodeAddresses(addresses, onProgress) {
  const unique = [...new Set(addresses.map((a) => a.trim()).filter(Boolean))];
  const results = new Map();

  for (let i = 0; i < unique.length; i++) {
    const addr = unique[i];
    const wasCached = getCached(addr) !== undefined;
    const result = await geocodeOne(addr);
    results.set(addr, result);
    onProgress?.(i + 1, unique.length);
    if (!wasCached) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
  }

  return results;
}