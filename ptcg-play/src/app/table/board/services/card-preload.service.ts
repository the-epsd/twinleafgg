import { Injectable } from '@angular/core';
import { Card, Replay } from 'ptcg-server';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

@Injectable()
export class CardPreloadService {

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) {}

  /**
   * Resolve deck card names to 3D scan URLs. Returns URLs for cards that can be preloaded.
   */
  preloadFromDeckCards(cardNames: string[]): string[] {
    const urls: string[] = [];
    const seen = new Set<string>();

    for (const name of cardNames) {
      if (!name || !name.trim()) continue;

      const card = this.cardsBaseService.getCardByName(name);
      if (!card) continue;

      const url = this.cardsBaseService.getScanUrlFor3D(card);
      if (url && url.trim() && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }

    return urls;
  }

  /**
   * Extract unique cards from replay states and return 3D scan URLs.
   * Samples states to balance coverage vs performance.
   */
  preloadFromReplay(replay: Replay): string[] {
    const count = replay.getStateCount();
    if (count === 0) return [];

    const cardSet = new Set<Card>();
    const indicesToSample: number[] = [];

    if (count <= 10) {
      for (let i = 0; i < count; i++) indicesToSample.push(i);
    } else {
      indicesToSample.push(0);
      indicesToSample.push(Math.floor(count / 4));
      indicesToSample.push(Math.floor(count / 2));
      indicesToSample.push(count - 1);
      for (let i = 10; i < count - 1; i += 10) {
        indicesToSample.push(i);
      }
    }

    for (const idx of indicesToSample) {
      if (idx < 0 || idx >= count) continue;
      try {
        const state = replay.getState(idx);
        for (const player of state.players) {
          this.collectCardsFromPlayer(player, cardSet);
        }
      } catch {
        // Skip invalid states
      }
    }

    const urls: string[] = [];
    const seenUrls = new Set<string>();

    for (const card of cardSet) {
      if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') continue;

      const url = this.cardsBaseService.getScanUrlFor3D(card);
      if (url && url.trim() && !seenUrls.has(url)) {
        seenUrls.add(url);
        urls.push(url);
      }
    }

    return urls;
  }

  private collectCardsFromPlayer(player: any, cardSet: Set<Card>): void {
    const lists = [
      player.deck?.cards,
      player.hand?.cards,
      player.discard?.cards,
      player.lostzone?.cards,
      player.stadium?.cards,
      player.supporter?.cards,
      player.active?.cards,
      ...(player.bench || []).flatMap((b: any) => b?.cards || []),
      ...(player.prizes || []).flatMap((p: any) => p?.cards || [])
    ];

    for (const cards of lists) {
      if (!Array.isArray(cards)) continue;
      for (const card of cards) {
        if (card && typeof card === 'object') {
          cardSet.add(card);
        }
      }
    }
  }

  /**
   * Preload URLs and wait for completion (with optional timeout).
   */
  async preloadAndWait(urls: string[], timeoutMs?: number): Promise<void> {
    if (!urls || urls.length === 0) return;
    await this.assetLoader.preloadCardTexturesAsync(urls, timeoutMs);
  }
}
