import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 text-center text-sm text-slate-400 lg:px-8">
        <p>Silsilah Keluarga Besar &middot; Dibuat dengan penuh rasa hormat untuk generasi mendatang.</p>
        <Link to="/admin" className="text-xs text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500">
          Admin
        </Link>
      </div>
    </footer>
  );
}
