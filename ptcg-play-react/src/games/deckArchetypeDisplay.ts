import { Archetype } from 'ptcg-server';

type DeckArchetypeSource = {
  manualArchetype1?: Archetype;
  manualArchetype2?: Archetype;
};

/** Manual archetypes only; otherwise Unown until detection is ported. */
export function deckArchetypeForDisplay(deck: DeckArchetypeSource): Archetype | Archetype[] {
  const a: Archetype[] = [];
  if (deck.manualArchetype1 != null) {
    a.push(deck.manualArchetype1);
  }
  if (deck.manualArchetype2 != null) {
    a.push(deck.manualArchetype2);
  }
  if (a.length === 0) {
    return Archetype.UNOWN;
  }
  return a.length === 1 ? a[0]! : a;
}
