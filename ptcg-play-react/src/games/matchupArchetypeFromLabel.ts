import { Archetype } from 'ptcg-server';

function singlePartToArchetype(part: string): Archetype | null {
  if (!part || part === 'UNKNOWN') {
    return Archetype.UNOWN;
  }
  const upper = part.toUpperCase().replace(/\s+/g, '_');
  const enumKey = Object.keys(Archetype).find((key) => key === upper);
  if (enumKey) {
    return Archetype[enumKey as keyof typeof Archetype] as Archetype;
  }
  const enumValue = Object.values(Archetype).find(
    (value) => typeof value === 'string' && value.toUpperCase() === upper,
  );
  if (enumValue) {
    return enumValue as Archetype;
  }
  return Archetype.UNOWN;
}

/** Maps server matchup keys like "CHARIZARD" or "CHARIZARD/PIDGEOT" to enum values for ArchetypeIcon. */
export function matchupArchetypesFromLabel(archetypeLabel: string): Archetype[] {
  if (!archetypeLabel || archetypeLabel === 'UNKNOWN') {
    return [Archetype.UNOWN];
  }
  const parts = archetypeLabel
    .split('/')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const out: Archetype[] = [];
  for (const part of parts) {
    const single = singlePartToArchetype(part);
    if (single !== null) {
      out.push(single);
    }
  }
  return out.length > 0 ? out : [Archetype.UNOWN];
}
