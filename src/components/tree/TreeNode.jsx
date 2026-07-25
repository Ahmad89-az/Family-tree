import { useState } from 'react';
import PersonCard from './PersonCard';
import { useFamilyData } from '../../context/FamilyDataContext';
import { getSpouses, getChildren } from '../../utils/familyUtils';

export default function TreeNode({ personId, depth = 0, onOpenProfile, visited }) {
  const { members } = useFamilyData();
  const [expanded, setExpanded] = useState(depth < 2);

  if (visited.has(personId)) return null;
  const localVisited = new Set(visited);
  localVisited.add(personId);

  const person = members.find((m) => m.id === personId);
  if (!person) return null;

  const spouses = getSpouses(members, person);
  spouses.forEach((s) => localVisited.add(s.id));
  const children = getChildren(members, person);

  return (
    <li>
      <div className="flex items-start gap-3">
        <PersonCard
          person={person}
          onClick={onOpenProfile}
          hasChildren={children.length > 0}
          expanded={expanded}
          onToggle={() => setExpanded((e) => !e)}
        />
        {spouses.map((s) => (
          <div key={s.id} className="flex items-center gap-1">
            <span className="mt-6 text-slate-300 dark:text-slate-600" aria-hidden>
              &#9671;
            </span>
            <PersonCard
              person={s}
              onClick={onOpenProfile}
              hasChildren={false}
              expanded={false}
              onToggle={() => {}}
            />
          </div>
        ))}
      </div>

      {children.length > 0 && expanded && (
        <ul>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              personId={child.id}
              depth={depth + 1}
              onOpenProfile={onOpenProfile}
              visited={localVisited}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
