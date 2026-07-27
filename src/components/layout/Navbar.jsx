import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, GitBranch } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/pohon-keluarga', label: 'Pohon Keluarga' },
  { to: '/cari', label: 'Cari Anggota' },
  { to: '/linimasa', label: 'Linimasa' },
  { to: '/statistik', label: 'Statistik' },
  { to: '/peta', label: 'Peta' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md dark:bg-[#020617]/80 dark:border-slate-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-[var(--font-heading)] font-semibold text-[#0F172A] dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white dark:bg-slate-700">
            <GitBranch size={16} />
          </span>
          <span className="text-[15px] tracking-tight">Silsilah Keluarga</span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-[#0F172A] dark:bg-slate-800 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Ganti mode gelap/terang"
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0F172A] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Buka menu"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-border)] px-5 py-3 lg:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-slate-100 text-[#0F172A] dark:bg-slate-800 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
