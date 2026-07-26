// Helper functions untuk mengolah data silsilah keluarga

export function getMemberById(members, id) {
  return members.find((m) => m.id === id) || null;
}

export function getSpouses(members, member) {
  return (member.spouse || []).map((id) => getMemberById(members, id)).filter(Boolean);
}

export function getChildren(members, member) {
  return (member.children || []).map((id) => getMemberById(members, id)).filter(Boolean);
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