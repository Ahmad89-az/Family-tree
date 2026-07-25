import { useState } from 'react';
import { X } from 'lucide-react';
import { useFamilyData } from '../../context/FamilyDataContext';
import PersonCombobox from './PersonCombobox';

const avatar = (seed) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`;

const emptyForm = {
  name: '',
  nickname: '',
  gender: 'Male',
  birthDate: '',
  deathDate: '',
  photo: '',
  father: '',
  mother: '',
  spouse: '',
  address: '',
  occupation: '',
  education: '',
  notes: '',
};

export default function MemberFormModal({ member, onClose }) {
  const { members, addMember, updateMember } = useFamilyData();
  const isEdit = !!member;

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          ...emptyForm,
          ...member,
          father: member.father || '',
          mother: member.mother || '',
          spouse: (member.spouse || [])[0] || '',
        }
      : emptyForm
  );

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleRelationChange = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const memberId = isEdit ? member.id : crypto.randomUUID();
    const createdIds = new Set();

    // Resolve a relation value: if it's a "new:<Name>" placeholder, create that
    // member for real now; otherwise it's already an existing member's id.
    const resolvePerson = (value, gender) => {
      if (!value) return null;
      if (value.startsWith('new:')) {
        const name = value.slice(4).trim();
        if (!name) return null;
        const newId = crypto.randomUUID();
        createdIds.add(newId);
        addMember({
          id: newId,
          name,
          nickname: '',
          gender,
          birthDate: null,
          deathDate: null,
          photo: avatar(name),
          father: null,
          mother: null,
          spouse: [],
          children: [],
          address: '',
          occupation: '',
          education: '',
          notes: '',
          gallery: [],
        });
        return newId;
      }
      return value;
    };

    const fatherId = resolvePerson(form.father, 'Male');
    const motherId = resolvePerson(form.mother, 'Female');
    const spouseId = resolvePerson(form.spouse, form.gender === 'Male' ? 'Female' : 'Male');

    const payload = {
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      gender: form.gender,
      birthDate: form.birthDate || null,
      deathDate: form.deathDate || null,
      photo: form.photo.trim() || avatar(form.name),
      father: fatherId,
      mother: motherId,
      spouse: spouseId ? [spouseId] : [],
      children: isEdit ? member.children || [] : [],
      address: form.address.trim(),
      occupation: form.occupation.trim(),
      education: form.education.trim(),
      notes: form.notes.trim(),
      gallery: isEdit ? member.gallery || [] : [],
    };

    if (isEdit) {
      updateMember(member.id, payload);
    } else {
      addMember({ ...payload, id: memberId });
    }

    // Link this member into its parents' `children` arrays.
    [fatherId, motherId].filter(Boolean).forEach((pid) => {
      if (createdIds.has(pid)) {
        updateMember(pid, { children: [memberId] });
      } else {
        const parent = members.find((m) => m.id === pid);
        if (parent && !(parent.children || []).includes(memberId)) {
          updateMember(pid, { children: [...(parent.children || []), memberId] });
        }
      }
    });

    // Link this member into its spouse's `spouse` array.
    if (spouseId) {
      if (createdIds.has(spouseId)) {
        updateMember(spouseId, { spouse: [memberId] });
      } else {
        const sp = members.find((m) => m.id === spouseId);
        if (sp && !(sp.spouse || []).includes(memberId)) {
          updateMember(spouseId, { spouse: [...(sp.spouse || []), memberId] });
        }
      }
    }

    // If editing and a relation was changed/removed, clean up the old link too.
    if (isEdit) {
      const prevFather = member.father;
      const prevMother = member.mother;
      const prevSpouseId = (member.spouse || [])[0];

      if (prevFather && prevFather !== fatherId) {
        const pf = members.find((m) => m.id === prevFather);
        if (pf) updateMember(prevFather, { children: (pf.children || []).filter((c) => c !== memberId) });
      }
      if (prevMother && prevMother !== motherId) {
        const pm = members.find((m) => m.id === prevMother);
        if (pm) updateMember(prevMother, { children: (pm.children || []).filter((c) => c !== memberId) });
      }
      if (prevSpouseId && prevSpouseId !== spouseId) {
        const ps = members.find((m) => m.id === prevSpouseId);
        if (ps) updateMember(prevSpouseId, { spouse: (ps.spouse || []).filter((s) => s !== memberId) });
      }
    }

    onClose();
  };

  const otherMembers = members.filter((m) => !isEdit || m.id !== member.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <div
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 dark:border-slate-700">
          <h3 className="font-[var(--font-heading)] text-base font-semibold text-[#0F172A] dark:text-white">
            {isEdit ? 'Ubah Anggota Keluarga' : 'Tambah Anggota Keluarga'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-[#0F172A] dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Lengkap" required>
              <input required value={form.name} onChange={handleChange('name')} className={inputCls} />
            </Field>
            <Field label="Nama Panggilan">
              <input value={form.nickname} onChange={handleChange('nickname')} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jenis Kelamin">
              <select value={form.gender} onChange={handleChange('gender')} className={inputCls}>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </Field>
            <Field label="Foto (URL, opsional)">
              <input value={form.photo} onChange={handleChange('photo')} placeholder="Otomatis jika kosong" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal Lahir">
              <input type="date" value={form.birthDate || ''} onChange={handleChange('birthDate')} className={inputCls} />
            </Field>
            <Field label="Tanggal Wafat">
              <input type="date" value={form.deathDate || ''} onChange={handleChange('deathDate')} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ayah">
              <PersonCombobox
                value={form.father}
                onChange={handleRelationChange('father')}
                members={otherMembers}
                placeholder="Cari atau ketik nama ayah..."
              />
            </Field>
            <Field label="Ibu">
              <PersonCombobox
                value={form.mother}
                onChange={handleRelationChange('mother')}
                members={otherMembers}
                placeholder="Cari atau ketik nama ibu..."
              />
            </Field>
          </div>

          <Field label="Pasangan">
            <PersonCombobox
              value={form.spouse}
              onChange={handleRelationChange('spouse')}
              members={otherMembers}
              placeholder="Cari atau ketik nama pasangan..."
            />
          </Field>
          <p className="-mt-2 text-xs text-slate-400">
            Kalau nama orang tua atau pasangan belum ada di data, cukup ketik namanya lalu pilih "Buat anggota baru" — otomatis dibuatkan dan langsung dihubungkan.
          </p>

          <Field label="Alamat">
            <input value={form.address} onChange={handleChange('address')} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Pekerjaan">
              <input value={form.occupation} onChange={handleChange('occupation')} className={inputCls} />
            </Field>
            <Field label="Pendidikan">
              <input value={form.education} onChange={handleChange('education')} className={inputCls} />
            </Field>
          </div>

          <Field label="Catatan Keluarga">
            <textarea rows={3} value={form.notes} onChange={handleChange('notes')} className={inputCls} />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Batal
            </button>
            <button type="submit" className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm font-medium text-white hover:-translate-y-0.5 transition-transform dark:bg-slate-100 dark:text-[#0F172A]">
              {isEdit ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}{required && ' *'}
      </span>
      {children}
    </label>
  );
}