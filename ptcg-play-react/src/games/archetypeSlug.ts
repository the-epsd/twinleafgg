import { Archetype } from 'ptcg-server';

export function archetypeToSlug(archetype: Archetype): string {
  const key = Object.keys(Archetype).find((k) => Archetype[k as keyof typeof Archetype] === archetype);
  if (key) {
    return key.toLowerCase().replace(/_/g, '-');
  }
  if (typeof archetype === 'string') {
    return archetype.toLowerCase().replace(/_/g, '-');
  }
  return 'unown';
}

export function gen9SpriteUrl(slug: string): string {
  return `https://r2.limitlesstcg.net/pokemon/gen9/${slug}.png`;
}
