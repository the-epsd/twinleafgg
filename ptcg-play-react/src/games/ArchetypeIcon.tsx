import { Archetype } from 'ptcg-server';
import { archetypeToSlug, gen9SpriteUrl } from './archetypeSlug';
import styles from './ArchetypeIcon.module.css';

function normalizeArchetypes(value: Archetype | Archetype[] | undefined | null): string[] {
  if (value == null) {
    return ['unown'];
  }
  if (Array.isArray(value)) {
    const slugs = [...new Set(value.filter((v) => v != null).map((v) => archetypeToSlug(v)))].slice(0, 2);
    return slugs.length > 0 ? slugs : ['unown'];
  }
  return [archetypeToSlug(value)];
}

export interface ArchetypeIconProps {
  archetypes: Archetype | Archetype[] | undefined | null;
  /** Visual scale for lobby artwork (e.g. 3) or deck tiles (e.g. 1.8). Default 1 — no extra wrapper. */
  scale?: number;
  className?: string;
}

export function ArchetypeIcon({ archetypes, scale = 1, className }: ArchetypeIconProps) {
  const slugs = normalizeArchetypes(archetypes);
  const isSingle = slugs.length === 1;
  const inner = (
    <div className={`${styles.container} ${isSingle ? styles.single : ''} ${className ?? ''}`}>
      {slugs.map((slug) => (
        <div
          key={slug}
          className={styles.sprite}
          style={{ backgroundImage: `url(${gen9SpriteUrl(slug)})` }}
          role="img"
          aria-hidden
        />
      ))}
    </div>
  );
  if (scale !== 1) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {inner}
      </div>
    );
  }
  return inner;
}
