import { Injectable } from '@angular/core';
import { Scene, Vector3 } from 'three';
import { Player, CardList } from 'ptcg-server';
import { Board3dStackService, UpdateCardCallback, GetCardByIdCallback } from './board-3d-stack.service';

// Callback type for removing cards (to avoid circular dependency)
export type RemoveCardCallback = (cardId: string, scene: Scene) => void;

@Injectable()
export class Board3dPrizeService {
  constructor(private stackService: Board3dStackService) { }

  /**
   * Update or create prize cards in a 2x3 grid layout
   */
  async updatePrizes(
    playerPrefix: string,
    prizes: CardList[],
    basePosition: Vector3,
    isOwner: boolean,
    rotation: number,
    scene: Scene,
    player: Player,
    updateCardCallback: UpdateCardCallback,
    removeCardCallback: RemoveCardCallback,
    getCardByIdCallback: GetCardByIdCallback
  ): Promise<void> {
    // Clean up old prize stack if it exists (from previous stack-based rendering)
    // Note: This uses deckStacks from stackService, which is a legacy pattern
    const oldStackId = `${playerPrefix}_prizes`;
    this.stackService.removeStack(oldStackId, scene, true);

    // Ensure we have 6 prize slots
    const prizeSlots = prizes || [];

    // Get sleeve image path from player (fallback if not on individual prizes)
    const playerSleeveImagePath = (player as any)?.sleeveImagePath;

    // Loop through all 6 prize slots
    for (let index = 0; index < 6; index++) {
      const prizeId = `${playerPrefix}_prize_${index}`;
      const prize = prizeSlots[index];

      if (prize && prize.cards.length > 0) {
        // Calculate grid position for this prize (2 columns, 3 rows)
        const row = Math.floor(index / 2); // 0, 0, 1, 1, 2, 2
        const col = index % 2; // 0, 1, 0, 1, 0, 1
        const offsetX = (col - 0.5) * 3; // -1.25, 1.25, -1.25, 1.25, -1.25, 1.25
        const offsetZ = (row - 1) * 4; // -4, -4, 0, 0, 4, 4
        const gridPosition = new Vector3(
          basePosition.x + offsetX,
          basePosition.y,
          basePosition.z + offsetZ
        );

        // Extract sleeve image path from prize CardList, fallback to player-level sleeve
        const sleeveImagePath = (prize as any)?.sleeveImagePath || playerSleeveImagePath;

        // Render the prize card
        await updateCardCallback(
          prize,
          prizeId,
          gridPosition,
          isOwner,
          rotation,
          scene,
          undefined, // No cardTarget for prizes
          1.0, // Normal scale
          sleeveImagePath
        );

        // Mark prize card for click detection
        const prizeCardMesh = getCardByIdCallback(prizeId);
        if (prizeCardMesh) {
          prizeCardMesh.getGroup().userData.isPrize = true;
        }
      } else {
        // Remove empty prize slot
        removeCardCallback(prizeId, scene);
      }
    }
  }

  /**
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    // Prizes use cardsMap from main service, so no direct cleanup needed here
    // The main service will handle card disposal
  }
}
