import { Pipe, PipeTransform } from '@angular/core';
import { Card } from 'ptcg-server';

interface ArtworkLike {
  id: number;
  name: string;
  cardName: string;
  setCode: string;
  code: string;
  imageUrl: string;
  holoType: string;
}

@Pipe({ name: 'artworksFor' })
export class ArtworksForPipe implements PipeTransform {
  transform(artworks: ArtworkLike[] | null | undefined, card: Card | null | undefined): ArtworkLike[] {
    if (!artworks || !card) return [];
    // Normalize helpers
    const norm = (s: string) => (s || '').toLowerCase().trim();
    const cardName = norm(card.name);
    const setCode = norm(card.set);
    const fullName = norm((card as any).fullName || `${card.name} ${card.set}`);

    return artworks.filter(a => {
      const aName = norm(a.cardName);
      const aSet = norm(a.setCode);
      const aCode = norm(a.code);
      // Match either by (name + set) or by full code equality
      return (aName === cardName && aSet === setCode) || aCode === fullName;
    });
  }
}


