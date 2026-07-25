import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, Briefcase, GraduationCap, Heart, Users, Baby, Calendar } from 'lucide-react';
import { getParents, getSpouses, getChildren, getAge, formatDate, spouseLetter, getChildParentLabel } from '../../utils/familyUtils';
import { useFamilyData } from '../../context/FamilyDataContext';

export default function ProfileModal({ member, onClose, onNavigate }) {
  const { members } = useFamilyData();
  if (!member) return null;

  const parents = getParents(members, member);
  const spouses = getSpouses(members, member);
  const children = getChildren(members, member);
  const age = getAge(member);
  const hasMultipleSpouses = spouses.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#0F172A]"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header banner — fixed height, no content that could grow into the overlap zone */}
          <div className="relative flex h-20 items-start justify-between bg-gradient-to-br from-[#0F172A] to-[#334155] px-6 pt-5 sm:px-8">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
              {member.deathDate ? 'Almarhum/Almarhumah' : 'Anggota Keluarga'}
            </span>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 pb-8 sm:px-8">
            {/* Avatar overlaps the header on its own — the name block below never does */}
            <div className="flex items-start gap-4">
              <img
                src={member.photo}
                alt={member.name}
                className="relative z-10 -mt-10 h-20 w-20 flex-shrink-0 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-md dark:border-[#0F172A]"
              />
              <div className="pt-1">
                <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[#0F172A] dark:text-white">
                  {member.name}
                </h2>
                {member.nickname && (
                  <p className="text-sm text-slate-400">Dipanggil "{member.nickname}"</p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={Calendar} label="Lahir" value={`${formatDate(member.birthDate)}${age !== null ? ` (${member.deathDate ? '' : `${age} tahun`})` : ''}`} />
              {member.deathDate && <InfoRow icon={Calendar} label="Wafat" value={formatDate(member.deathDate)} />}
              <InfoRow icon={MapPin} label="Alamat" value={member.address || '-'} />
              <InfoRow icon={Briefcase} label="Pekerjaan" value={member.occupation || '-'} />
              <InfoRow icon={GraduationCap} label="Pendidikan" value={member.education || '-'} />
            </div>

            {member.notes && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                {member.notes}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {parents.length > 0 && (
                <RelationGroup icon={Users} title="Orang Tua" people={parents} onNavigate={onNavigate} />
              )}
              {spouses.length > 0 && (
                <RelationGroup
                  icon={Heart}
                  title={`Pasangan${hasMultipleSpouses ? ` (${spouses.length})` : ''}`}
                  people={spouses}
                  onNavigate={onNavigate}
                  getLabel={hasMultipleSpouses ? (_, i) => spouseLetter(i) : undefined}
                />
              )}
              {children.length > 0 && (
                <RelationGroup
                  icon={Baby}
                  title={`Anak (${children.length})`}
                  people={children}
                  onNavigate={onNavigate}
                  getLabel={hasMultipleSpouses ? (child) => getChildParentLabel(member, child) : undefined}
                />
              )}
            </div>

            {member.gallery?.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Galeri Foto</p>
                <div className="flex gap-2 overflow-x-auto">
                  {member.gallery.map((g, i) => (
                    <img key={i} src={g} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
      <div>
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="text-slate-700 dark:text-slate-200">{value}</span>
      </div>
    </div>
  );
}

function RelationGroup({ icon: Icon, title, people, onNavigate, getLabel }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
        <Icon size={13} /> {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {people.map((p, i) => {
          const label = getLabel ? getLabel(p, i) : null;
          return (
            <button
              key={p.id}
              onClick={() => onNavigate?.(p)}
              className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <img src={p.photo} alt="" className="h-5 w-5 rounded-full object-cover" />
              <span className="text-slate-700 dark:text-slate-200">
                {p.name}
                {label && <span className="ml-1 text-slate-400">({label})</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}