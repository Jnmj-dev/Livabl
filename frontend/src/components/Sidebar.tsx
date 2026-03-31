import { useState } from 'react';
import type { Neighborhood, ScoreCategory } from '../types';
import { getBadgeStyle } from '../utils';
import ScoreBar from './ScoreBar';

interface SidebarProps {
  neighborhoods: Neighborhood[];
  selected: Neighborhood | null;
  onSelect: (n: Neighborhood) => void;
  activeCategory: ScoreCategory;
}

const BREAKDOWN_LABELS: { key: keyof Neighborhood['breakdown']; label: string }[] = [
  { key: 'safety', label: 'Safety' },
  { key: 'walkability', label: 'Walkability' },
  { key: 'transit', label: 'Transit' },
  { key: 'schools', label: 'Schools' },
  { key: 'greenery', label: 'Greenery' },
  { key: 'noise', label: 'Noise' },
];

type SidebarTab = 'Overview' | 'Compare' | 'Trends' | 'Reports';

function getDisplayScore(n: Neighborhood, cat: ScoreCategory): number {
  if (cat === 'all') return n.score;
  if (cat in n.breakdown) return n.breakdown[cat as keyof Neighborhood['breakdown']];
  return n.score;
}

export default function Sidebar({ neighborhoods, selected, onSelect, activeCategory }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Overview');

  const sorted = [...neighborhoods].sort(
    (a, b) => getDisplayScore(b, activeCategory) - getDisplayScore(a, activeCategory)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-tabs">
        {(['Overview', 'Compare', 'Trends', 'Reports'] as SidebarTab[]).map((t) => (
          <button
            key={t}
            className={`tab ${t === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {selected && activeTab === 'Overview' && (
          <div className="score-hero">
            <div className="score-hero-location">{selected.city}, {selected.region}</div>
            <div className="score-hero-name">{selected.name}</div>
            <div className="score-hero-big">
              <div
                className="score-num"
                style={{ color: selected.score >= 75 ? '#4ade80' : selected.score >= 55 ? '#fbbf24' : '#f87171' }}
              >
                {selected.score}
              </div>
              <div className="score-label">Livability<br />Score</div>
            </div>
            <div className="score-bar-row">
              {BREAKDOWN_LABELS.map(({ key, label }, i) => (
                <ScoreBar key={key} label={label} value={selected.breakdown[key]} delay={i * 60} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'Trends' || activeTab === 'Reports' || activeTab === 'Compare') && (
          <div className="score-hero">
            <div className="score-hero-location">{activeTab}</div>
            <div className="score-hero-name">Coming soon</div>
          </div>
        )}

        <div className="section-label">Nearby Neighborhoods</div>

        {sorted.map((n, i) => {
          const displayScore = getDisplayScore(n, activeCategory);
          const badge = getBadgeStyle(displayScore);
          return (
            <div
              key={n.id}
              className={`hood-card ${selected?.id === n.id ? 'selected' : ''}`}
              onClick={() => onSelect(n)}
            >
              <div className="hood-rank">{i + 1}</div>
              <div className="hood-info">
                <div className="hood-name">{n.name}</div>
                <div className="hood-sub">{n.region} · {n.area_km2}km²</div>
              </div>
              <div className="score-badge" style={{ background: badge.background, color: badge.color }}>
                {displayScore}
              </div>
            </div>
          );
        })}

        <div style={{ height: 16 }} />
      </div>
    </aside>
  );
}
