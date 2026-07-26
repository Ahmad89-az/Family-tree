import { useRef, useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Maximize, Minimize, RotateCcw, Move } from 'lucide-react';
import TreeNode from './TreeNode';
import ProfileModal from '../profile/ProfileModal';
import Breadcrumb from './Breadcrumb';
import PersonJumpSearch from './PersonJumpSearch';
import { useFamilyData } from '../../context/FamilyDataContext';
import { findRoots, getMainRoot } from '../../utils/familyUtils';

export default function FamilyTreeView() {
  const { members } = useFamilyData();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const roots = findRoots(members);
  const [rootId, setRootId] = useState(() => getMainRoot(members, roots)?.id);

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

  if (!rootId) {
    return <p className="p-8 text-center text-slate-400">Belum ada data keluarga.</p>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${isFullscreen ? 'h-screen bg-[var(--color-bg)] dark:bg-[#020617]' : 'h-[calc(100vh-9rem)] min-h-[500px]'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-400">Mulai dari:</label>
          <PersonJumpSearch members={members} currentId={rootId} onSelect={setRootId} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Move size={13} /> Seret untuk geser &middot; Scroll untuk zoom
        </div>
      </div>

      <TransformWrapper
        minScale={0.15}
        maxScale={2}
        initialScale={0.6}
        centerOnInit
        limitToBounds={false}
        wheel={{ step: 0.08 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <ControlBtn onClick={() => zoomIn()} label="Perbesar"><ZoomIn size={16} /></ControlBtn>
              <ControlBtn onClick={() => zoomOut()} label="Perkecil"><ZoomOut size={16} /></ControlBtn>
              <ControlBtn onClick={() => resetTransform()} label="Reset tampilan"><RotateCcw size={16} /></ControlBtn>
              <ControlBtn onClick={toggleFullscreen} label="Layar penuh">
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </ControlBtn>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%', flex: 1 }}
              contentStyle={{ width: '100%' }}
            >
              <div className="px-16 py-16">
                <ul className="org-tree">
                  <TreeNode
                    personId={rootId}
                    onOpenProfile={setSelectedPerson}
                    visited={new Set()}
                  />
                </ul>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {selectedPerson && (
        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <Breadcrumb member={selectedPerson} />
        </div>
      )}

      {selectedPerson && (
        <ProfileModal
          member={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onNavigate={setSelectedPerson}
        />
      )}
    </div>
  );
}

function ControlBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0F172A] dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      {children}
    </button>
  );
}