import { ChevronRight } from 'lucide-react';
import { useFamilyData } from '../../context/FamilyDataContext';
import { getAncestryPath } from '../../utils/familyUtils';

export default function Breadcrumb({ member }) {
  const { members } = useFamilyData();
  const path = getAncestryPath(members, member);

  return (
    <div className="flex max-w-[90vw] items-center gap-1 overflow-x-auto rounded-full border border-[var(--color-border)] bg-white/95 px-3 py-1.5 text-xs shadow-md backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
      {path.map((p, i) => (
        <span key={p.id} className="flex flex-shrink-0 items-center gap-1">
          {i > 0 && <ChevronRight size={11} className="text-slate-300 dark:text-slate-600" />}
          <span className={i === path.length - 1 ? 'font-medium text-[#0F172A] dark:text-white' : 'text-slate-400'}>
            {p.nickname || p.name}
          </span>
        </span>
      ))}
    </div>
  );
}
