import { Injectable } from '@angular/core';
import { Player, CardList } from 'ptcg-server';
import { Vector3, Scene, Group, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Euler } from 'three';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

// Zone positions in 3D world space
const ZONE_POSITIONS = {
  bottomPlayer: {
    active: new Vector3(0, 0.1, 12),
    bench: [
      new Vector3(-12, 0.1, 18),
      new Vector3(-8, 0.1, 18),
      new Vector3(-4, 0.1, 18),
      new Vector3(0, 0.1, 18),
      new Vector3(4, 0.1, 18),
      new Vector3(8, 0.1, 18),
      new Vector3(12, 0.1, 18),
      new Vector3(16, 0.1, 18),
    ],
    prizes: new Vector3(20, 0.1, 15),
    deck: new Vector3(18, 0.1, 12),
    discard: new Vector3(20, 0.1, 18),
    lostZone: new Vector3(-18, 0.1, 12),
    stadium: new Vector3(0, 0.1, 5)
  },
  topPlayer: {
    active: new Vector3(0, 0.1, -12),
    bench: [
      new Vector3(12, 0.1, -18),
      new Vector3(8, 0.1, -18),
      new Vector3(4, 0.1, -18),
      new Vector3(0, 0.1, -18),
      new Vector3(-4, 0.1, -18),
      new Vector3(-8, 0.1, -18),
      new Vector3(-12, 0.1, -18),
      new Vector3(-16, 0.1, -18),
    ],
    prizes: new Vector3(-20, 0.1, -15),
    deck: new Vector3(18, 0.1, -12),
    discard: new Vector3(20, 0.1, -18),
    lostZone: new Vector3(-18, 0.1, -12),
    stadium: new Vector3(0, 0.1, -5)
  }
};

@Injectable()
export class Board3dStateSyncService {
  private cardsMap: Map<string, Board3dCard> = new Map();
  private deckStacks: Map<string, InstancedMesh> = new Map();

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) {}

  /**
   * Synchronize the entire game state to the 3D scene
   */
  async syncState(
    gameState: LocalGameState,
    scene: Scene,
    currentPlayerId: number
  ): Promise<void> {
    if (!gameState || !gameState.state) {
      return;
    }

    const state = gameState.state;

    // Clear old cards that no longer exist
    this.cleanupOldCards(state);

    // Sync both players
    if (state.players[0]) {
      await this.syncPlayer(
        state.players[0],
        'bottomPlayer',
        state.players[0].id === currentPlayerId,
        scene
      );
    }

    if (state.players[1]) {
      await this.syncPlayer(
        state.players[1],
        'topPlayer',
        state.players[1].id === currentPlayerId,
        scene
      );
    }
  }

  /**
   * Sync a single player's board state
   */
  private async syncPlayer(
    player: Player,
    position: 'topPlayer' | 'bottomPlayer',
    isOwner: boolean,
    scene: Scene
  ): Promise<void> {
    const rotation = position === 'topPlayer' ? 180 : 0;
    const playerPrefix = `${position}_${player.id}`;

    // Active Pokemon
    if (player.active && player.active.cards.length > 0) {
      await this.updateCard(
        player.active,
        `${playerPrefix}_active`,
        ZONE_POSITIONS[position].active,
        isOwner,
        rotation,
        scene
      );
    } else {
      this.removeCard(`${playerPrefix}_active`, scene);
    }

    // Bench Pokemon
    for (let i = 0; i < player.bench.length; i++) {
      const benchCard = player.bench[i];
      const cardId = `${playerPrefix}_bench_${i}`;

      if (benchCard && benchCard.cards.length > 0) {
        await this.updateCard(
          benchCard,
          cardId,
          ZONE_POSITIONS[position].bench[i],
          isOwner,
          rotation,
          scene
        );
      } else {
        this.removeCard(cardId, scene);
      }
    }

    // Deck stack
    if (player.deck && player.deck.cards.length > 0) {
      await this.updateDeckStack(
        `${playerPrefix}_deck`,
        player.deck.cards.length,
        ZONE_POSITIONS[position].deck,
        rotation,
        scene
      );
    }

    // Discard pile (show top card)
    if (player.discard && player.discard.cards.length > 0) {
      await this.updateCard(
        player.discard,
        `${playerPrefix}_discard`,
        ZONE_POSITIONS[position].discard,
        true, // Always visible
        rotation,
        scene
      );
    } else {
      this.removeCard(`${playerPrefix}_discard`, scene);
    }

    // Stadium card
    if (player.stadium && player.stadium.cards.length > 0) {
      await this.updateCard(
        player.stadium,
        `${playerPrefix}_stadium`,
        ZONE_POSITIONS[position].stadium,
        true, // Always visible
        rotation,
        scene
      );
    } else {
      this.removeCard(`${playerPrefix}_stadium`, scene);
    }

    // Prize cards (show as stack)
    if (player.prizes && player.prizes.length > 0) {
      const prizesWithCards = player.prizes.filter(p => p.cards.length > 0);
      if (prizesWithCards.length > 0) {
        await this.updatePrizeStack(
          `${playerPrefix}_prizes`,
          prizesWithCards.length,
          ZONE_POSITIONS[position].prizes,
          rotation,
          scene
        );
      }
    }
  }

  /**
   * Update or create a card in the scene
   */
  private async updateCard(
    cardList: CardList,
    cardId: string,
    position: Vector3,
    isOwner: boolean,
    rotation: number,
    scene: Scene
  ): Promise<void> {
    const card = cardList.cards[0];
    if (!card) return;

    // Determine if card should be face-down (not public or is secret)
    const isFaceDown = !isOwner && (!cardList.isPublic || cardList.isSecret);

    // Get card scan URL
    const scanUrl = this.cardsBaseService.getScanUrl(card);

    // Load textures
    const [frontTexture, backTexture] = await Promise.all([
      isFaceDown
        ? this.assetLoader.loadCardBack()
        : this.assetLoader.loadCardTexture(scanUrl),
      this.assetLoader.loadCardBack()
    ]);

    // Check if card already exists
    let cardMesh = this.cardsMap.get(cardId);

    if (cardMesh) {
      // Update existing card
      cardMesh.updateTexture(frontTexture, backTexture);
      cardMesh.setPosition(position);
      cardMesh.setRotation(rotation);
    } else {
      // Create new card
      cardMesh = new Board3dCard(
        frontTexture,
        backTexture,
        position,
        rotation,
        1.0
      );

      cardMesh.getGroup().userData.cardId = cardId;
      cardMesh.getGroup().userData.cardData = card;

      scene.add(cardMesh.getGroup());
      this.cardsMap.set(cardId, cardMesh);
    }
  }

  /**
   * Update or create a deck stack using instanced rendering
   */
  private async updateDeckStack(
    stackId: string,
    cardCount: number,
    position: Vector3,
    rotation: number,
    scene: Scene
  ): Promise<void> {
    // Remove old stack if it exists
    const oldStack = this.deckStacks.get(stackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
    }

    // Create new stack
    const cardBackTexture = await this.assetLoader.loadCardBack();
    const geometry = new Board3dCard(
      cardBackTexture,
      cardBackTexture,
      new Vector3(0, 0, 0),
      rotation,
      1.0
    ).getMesh().geometry;

    const count = Math.min(cardCount, 60); // Max 60 instances
    const instancedMesh = new InstancedMesh(
      geometry,
      new MeshStandardMaterial({ map: cardBackTexture }),
      count
    );

    // Position and rotate each card in the stack
    const rotationRad = (rotation * Math.PI) / 180;
    const quaternion = new Quaternion().setFromEuler(new Euler(0, rotationRad, 0));
    
    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4();
      const pos = new Vector3(
        position.x,
        position.y + (i * 0.01), // Stack height
        position.z
      );
      // Compose matrix from position, rotation, and scale
      matrix.compose(pos, quaternion, new Vector3(1, 1, 1));
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.castShadow = true;

    scene.add(instancedMesh);
    this.deckStacks.set(stackId, instancedMesh);
  }

  /**
   * Update or create a prize card stack
   */
  private async updatePrizeStack(
    stackId: string,
    prizeCount: number,
    position: Vector3,
    rotation: number,
    scene: Scene
  ): Promise<void> {
    // For now, render prizes similar to deck
    await this.updateDeckStack(stackId, prizeCount, position, rotation, scene);
  }

  /**
   * Remove a card from the scene
   */
  private removeCard(cardId: string, scene: Scene): void {
    const card = this.cardsMap.get(cardId);
    if (card) {
      scene.remove(card.getGroup());
      card.dispose();
      this.cardsMap.delete(cardId);
    }
  }

  /**
   * Clean up cards that no longer exist in the game state
   */
  private cleanupOldCards(state: any): void {
    // This is a simple implementation - in production, you'd want to track
    // which cards should exist and remove ones that don't
    // For now, we'll rely on the card IDs being unique per position
  }

  /**
   * Get a card mesh by ID
   */
  getCardById(cardId: string): Board3dCard | undefined {
    return this.cardsMap.get(cardId);
  }

  /**
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    this.cardsMap.forEach(card => {
      scene.remove(card.getGroup());
      card.dispose();
    });
    this.cardsMap.clear();

    this.deckStacks.forEach(stack => {
      scene.remove(stack);
      stack.geometry.dispose();
      (stack.material as MeshStandardMaterial).dispose();
    });
    this.deckStacks.clear();
  }
}
