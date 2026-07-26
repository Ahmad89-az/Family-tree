// Helper functions untuk mengolah data silsilah keluarga

export function getMemberById(members, id) {
  return members.find((m) => m.id === id) || null;
}

export function getSpouses(members, member) {
  return (member.spouse || []).map((id) => getMemberById(members, id)).filter(Boolean);
}

export function getChildren(members, member) {
  const kids = (member.children || []).map((id) => getMemberById(members, id)).filter(Boolean);
  // Urutkan berdasarkan tanggal lahir (paling tua dulu), bukan urutan input data.
  // Yang belum punya tanggal lahir tetap ditaruh di belakang, sesuai urutan asal.
  return kids
    .map((kid, index) => ({ kid, index }))
    .sort((a, b) => {
      const aDate = a.kid.birthDate ? new Date(a.kid.birthDate).getTime() : null;
      const bDate = b.kid.birthDate ? new Date(b.kid.birthDate).getTime() : null;
      if (aDate !== null && bDate !== null) return aDate - bDate;
      if (aDate !== null) return -1;
      if (bDate !== null) return 1;
      return a.index - b.index;
    })
    .map((entry) => entry.kid);
}

export function getParents(members, member) {
  return [getMemberById(members, member.father), getMemberById(members, member.mother)].filter(Boolean);
}

export function getAge(member) {
  const start = new Date(member.birthDate);
  const end = member.deathDate ? new Date(member.deathDate) : new Date();
  if (isNaN(start)) return null;
  let age = end.getFullYear() - start.getFullYear();
  const m = end.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < start.getDate())) age--;
  return age;
}

export function getGeneration(members, member, cache = new Map()) {
  if (cache.has(member.id)) return cache.get(member.id);
  if (!member.father && !member.mother) {
    cache.set(member.id, 1);
    return 1;
  }
  const father = getMemberById(members, member.father);
  const mother = getMemberById(members, member.mother);
  const parentGen = Math.max(
    father ? getGeneration(members, father, cache) : 0,
    mother ? getGeneration(members, mother, cache) : 0
  );
  const gen = parentGen + 1;
  cache.set(member.id, gen);
  return gen;
}

export function getAllGenerations(members) {
  const cache = new Map();
  const map = {};
  members.forEach((m) => {
    const gen = getGeneration(members, m, cache);
    if (!map[gen]) map[gen] = [];
    map[gen].push(m);
  });
  return map;
}

// Breadcrumb: leluhur -> ... -> member (jalur ayah)
export function getAncestryPath(members, member) {
  const path = [member];
  let current = member;
  while (current.father || current.mother) {
    const parent = getMemberById(members, current.father) || getMemberById(members, current.mother);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }
  return path;
}

export function findRoots(members) {
  return members.filter((m) => !m.father && !m.mother);
}

// Total keturunan (anak, cucu, dst) dari seseorang.
export function countDescendants(members, id, visited = new Set()) {
  if (visited.has(id)) return 0;
  visited.add(id);
  const person = getMemberById(members, id);
  if (!person) return 0;
  const children = getChildren(members, person);
  let count = children.length;
  children.forEach((c) => {
    count += countDescendants(members, c.id, visited);
  });
  return count;
}

// Di antara beberapa akar/leluhur, pilih yang punya jumlah keturunan terbanyak —
// dipakai sebagai tampilan default pohon keluarga saat halaman pertama dibuka.
export function getMainRoot(members, roots) {
  if (!roots.length) return null;
  let best = roots[0];
  let bestCount = -1;
  roots.forEach((r) => {
    const count = countDescendants(members, r.id);
    if (count > bestCount) {
      bestCount = count;
      best = r;
    }
  });
  return best;
}

// Build nested tree node structure starting from a root id
export function buildTreeNode(members, id, visited = new Set()) {
  if (visited.has(id)) return null;
  visited.add(id);
  const member = getMemberById(members, id);
  if (!member) return null;
  const spouses = getSpouses(members, member);
  const children = getChildren(members, member)
    .map((c) => buildTreeNode(members, c.id, visited))
    .filter(Boolean);
  return { member, spouses, children };
}

export function searchMembers(members, query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return members.filter((m) => {
    const parents = getParents(members, m).map((p) => p.name.toLowerCase());
    const spouses = getSpouses(members, m).map((s) => s.name.toLowerCase());
    return (
      m.name.toLowerCase().includes(q) ||
      (m.nickname && m.nickname.toLowerCase().includes(q)) ||
      parents.some((p) => p.includes(q)) ||
      spouses.some((s) => s.includes(q))
    );
  });
}

export function getStatistics(members) {
  const total = members.length;
  const male = members.filter((m) => m.gender === 'Male').length;
  const female = members.filter((m) => m.gender === 'Female').length;
  const alive = members.filter((m) => !m.deathDate).length;
  const deceased = total - alive;
  const generations = getAllGenerations(members);
  const genCount = Object.keys(generations).length;
  const coreFamilies = members.filter((m) => (m.children || []).length > 0).length;

  // pertumbuhan keluarga per dekade kelahiran
  const growth = {};
  members.forEach((m) => {
    if (!m.birthDate) return;
    const year = new Date(m.birthDate).getFullYear();
    const decade = Math.floor(year / 10) * 10;
    growth[decade] = (growth[decade] || 0) + 1;
  });
  const growthData = Object.entries(growth)
    .map(([decade, count]) => ({ decade: `${decade}s`, count }))
    .sort((a, b) => parseInt(a.decade) - parseInt(b.decade));

  return { total, male, female, alive, deceased, genCount, coreFamilies, growthData, generations };
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Huruf urutan pasangan: index 0 -> 'a', 1 -> 'b', dst.
export function spouseLetter(index) {
  return String.fromCharCode(97 + index);
}

// Menentukan pasangan mana (istri/suami ke berapa) yang menjadi orang tua dari
// seorang anak, dikembalikan sebagai huruf sesuai urutan di array `member.spouse`.
// Contoh: jika anak.mother cocok dengan spouse kedua `member`, hasilnya 'b'.
export function getChildParentLabel(member, child) {
  const coParentId = member.gender === 'Female' ? child.father : child.mother;
  if (!coParentId) return null;
  const idx = (member.spouse || []).indexOf(coParentId);
  return idx === -1 ? null : spouseLetter(idx);
}

// ============================================================
// CEK HUBUNGAN KELUARGA
// ============================================================

// Telusuri semua leluhur seseorang (lewat ayah & ibu, ke atas terus),
// sekaligus catat levelnya (0 = diri sendiri, 1 = ortu, 2 = kakek/nenek, dst)
// dan "jejak" jalur ke tiap leluhur supaya bisa direkonstruksi belakangan.
function getAncestorLevelsWithPath(members, id) {
  const levels = new Map();
  const prev = new Map();
  const queue = [[id, 0]];
  while (queue.length) {
    const [curId, lvl] = queue.shift();
    if (levels.has(curId)) continue;
    levels.set(curId, lvl);
    const person = getMemberById(members, curId);
    if (!person) continue;
    if (person.father && !levels.has(person.father)) {
      prev.set(person.father, curId);
      queue.push([person.father, lvl + 1]);
    }
    if (person.mother && !levels.has(person.mother)) {
      prev.set(person.mother, curId);
      queue.push([person.mother, lvl + 1]);
    }
  }
  return { levels, prev };
}

// Rekonstruksi jalur dari seseorang naik ke salah satu leluhurnya, dipakai
// buat nampilin alur silsilah (mis. "Kamu -> Ayah -> Kakek Hasanuddin").
function reconstructPath(members, prev, fromId, ancestorId) {
  const path = [fromId];
  let cur = fromId;
  while (cur !== ancestorId) {
    const next = prev.get(cur);
    if (!next) break;
    path.push(next);
    cur = next;
  }
  return path.map((id) => getMemberById(members, id)).filter(Boolean);
}

function directLabel(n) {
  const down = { 1: 'Anak', 2: 'Cucu', 3: 'Cicit' };
  const up = { 1: 'Orang Tua', 2: 'Kakek/Nenek', 3: 'Buyut' };
  if (down[n]) return { down: down[n], up: up[n] };
  return { down: `Keturunan generasi ke-${n}`, up: `Leluhur generasi ke-${n}` };
}

function branchLabel(diff) {
  const map = { 1: ['Keponakan', 'Paman/Bibi'], 2: ['Cucu', 'Kakek/Nenek'], 3: ['Cicit', 'Buyut/Moyang'] };
  if (map[diff]) return { down: map[diff][0], up: map[diff][1] };
  return { down: `Keturunan generasi ke-${diff}`, up: `Leluhur generasi ke-${diff}` };
}

const COUSIN_WORDS = ['sekali', 'duakali', 'tigakali', 'empatkali', 'limakali', 'enamkali', 'tujuhkali', 'delapankali'];
function cousinLabel(n) {
  return `Sepupu ${COUSIN_WORDS[n - 1] || `${n}-kali`}`;
}

/**
 * Hitung hubungan keluarga antara 2 orang berdasarkan leluhur bersama mereka.
 * Bisa mengembalikan LEBIH DARI SATU hubungan sekaligus (misal kasus kawin
 * sesama kerabat, dua orang bisa berkerabat lewat 2 jalur leluhur berbeda).
 */
export function getRelationship(members, idA, idB) {
  if (idA === idB) return { same: true };
  const a = getMemberById(members, idA);
  const b = getMemberById(members, idB);
  if (!a || !b) return null;

  const { levels: levelsA, prev: prevA } = getAncestorLevelsWithPath(members, idA);
  const { levels: levelsB, prev: prevB } = getAncestorLevelsWithPath(members, idB);

  const commonIds = [...levelsA.keys()].filter((id) => levelsB.has(id));
  if (commonIds.length === 0) return { none: true };

  const candidates = commonIds.map((id) => ({ id, levelA: levelsA.get(id), levelB: levelsB.get(id) }));

  // Cuma simpan leluhur bersama yang PALING DEKAT tiap jalurnya — kalau ada
  // leluhur bersama yang lebih jauh tapi sudah "terwakili" oleh leluhur yang
  // lebih dekat, itu dianggap redundan dan dibuang. Tapi kalau ada jalur
  // leluhur bersama yang benar-benar berbeda (kawin sesama kerabat), keduanya
  // tetap dipertahankan.
  const minimal = candidates.filter(
    (cand) =>
      !candidates.some(
        (other) =>
          other.id !== cand.id &&
          other.levelA <= cand.levelA &&
          other.levelB <= cand.levelB &&
          (other.levelA < cand.levelA || other.levelB < cand.levelB)
      )
  );

  const siblingPair = minimal.filter((m) => m.levelA === 1 && m.levelB === 1);
  const rest = minimal.filter((m) => !(m.levelA === 1 && m.levelB === 1));

  const relations = [];

  if (siblingPair.length > 0) {
    const sameFather = !!a.father && a.father === b.father;
    const sameMother = !!a.mother && a.mother === b.mother;
    let label = 'Saudara';
    if (sameFather && sameMother) label = 'Saudara Kandung';
    else if (sameFather) label = 'Saudara Seayah';
    else if (sameMother) label = 'Saudara Seibu';
    relations.push({
      label,
      aToB: label,
      bToA: label,
      via: siblingPair.map((s) => getMemberById(members, s.id)).filter(Boolean),
      pathA: siblingPair.map((s) => reconstructPath(members, prevA, idA, s.id)),
      pathB: siblingPair.map((s) => reconstructPath(members, prevB, idB, s.id)),
    });
  }

  rest.forEach(({ id, levelA, levelB }) => {
    const ancestor = getMemberById(members, id);
    const pathA = reconstructPath(members, prevA, idA, id);
    const pathB = reconstructPath(members, prevB, idB, id);
    let aToB, bToA, label;

    if (levelA === 0 || levelB === 0) {
      const n = Math.max(levelA, levelB);
      const { down, up } = directLabel(n);
      aToB = levelA === 0 ? down : up;
      bToA = levelA === 0 ? up : down;
      label = aToB;
    } else if (levelA === levelB) {
      label = cousinLabel(levelA - 1);
      aToB = label;
      bToA = label;
    } else {
      const diff = Math.abs(levelA - levelB);
      const { down, up } = branchLabel(diff);
      // levelA lebih kecil dari levelB artinya A lebih dekat ke leluhur bersama
      // (generasi lebih "senior"), sehingga B berada di posisi "turunan" dari A.
      aToB = levelA < levelB ? down : up;
      bToA = levelA < levelB ? up : down;
      label = aToB;
    }

    relations.push({ label, aToB, bToA, via: ancestor ? [ancestor] : [], pathA: [pathA], pathB: [pathB] });
  });

  return { relations };
}