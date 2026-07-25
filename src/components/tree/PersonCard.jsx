import { ChevronDown, ChevronRight } from 'lucide-react';

export default function PersonCard({ person, onClick, hasChildren, expanded, onToggle }) {
  const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear() : '?';
  const deathYear = person.deathDate ? new Date(person.deathDate).getFullYear() : null;

  return (
    <div className="group relative">
      <button
        onClick={() => onClick(person)}
        className="flex w-[148px] flex-col items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-3 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-[#0F172A] dark:hover:border-slate-600"
      >
        <img
          src={person.photo}
          alt={person.name}
          className="h-12 w-12 rounded-full border-2 border-slate-100 object-cover dark:border-slate-700"
        />
        <span className="line-clamp-2 text-[13px] font-medium leading-tight text-[#0F172A] dark:text-slate-100">
          {person.name}
        </span>
        <span className="text-[11px] text-slate-400">
          {birthYear}{deathYear ? ` – ${deathYear}` : person.deathDate === null ? '' : ''}
        </span>
      </button>

      {hasChildren && (
        <button
          onClick={onToggle}
          aria-label={expanded ? 'Sembunyikan keturunan' : 'Tampilkan keturunan'}
          className="absolute -bottom-2.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-slate-500 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      )}
    </div>
  );
}
