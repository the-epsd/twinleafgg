import { Injectable } from '@angular/core';
import { CardList, Card } from 'ptcg-server';
import { Vector3, Scene, Group, Camera } from 'three';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

@Injectable()
export class Board3dHandService {
  private handCards: Map<number, Board3dCard> = new Map();
  private handGroup: Group;

  // Hand positioning (straight row)
  private cardSpacing = 3;           // Space between cards
  private handDistance = 25;         // Distance from camera (Z position)
  private handHeight = 1;          // Height in world space (raised above board to avoid clipping)

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) {
    this.handGroup = new Group();
    this.handGroup.position.set(0, this.handHeight, this.handDistance);
    // Ensure hand group has no rotation - cards should be flat like the deck
    this.handGroup.rotation.set(0.75, 0, 0);
  }

  /**
   * Update hand cards based on player's hand
   */
  async updateHand(
    hand: CardList,
    isOwner: boolean,
    scene: Scene
  ): Promise<void> {
    console.log('[Board3dHandService] updateHand called:', {
      handSize: hand?.cards?.length,
      isOwner,
      hasScene: !!scene
    });

    const cards = hand.cards;

    // Clear old cards
    console.log('[Board3dHandService] Clearing old hand cards:', this.handCards.size);
    this.clearHand();

    // Create new cards in arc formation
    console.log('[Board3dHandService] Creating new hand cards in arc formation');
    for (let i = 0; i < cards.length; i++) {
      await this.createHandCard(cards[i], i, cards.length, isOwner);
    }

    console.log('[Board3dHandService] Hand update completed:', {
      totalCardsCreated: this.handCards.size,
      handGroupChildren: this.handGroup.children.length
    });
  }

  /**
   * Create a single hand card in arc formation
   */
  private async createHandCard(
    card: Card,
    index: number,
    totalCards: number,
    isOwner: boolean
  ): Promise<void> {
    // Calculate position in straight line
    const position = this.calculateCardPosition(index, totalCards);
    const rotation = 0; // No rotation - cards face forward

    // Load texture
    const scanUrl = this.cardsBaseService.getScanUrl(card);
    const isFaceDown = !isOwner;

    const [frontTexture, backTexture] = await Promise.all([
      isFaceDown
        ? this.assetLoader.loadCardBack()
        : this.assetLoader.loadCardTexture(scanUrl),
      this.assetLoader.loadCardBack()
    ]);

    // Create card mesh with smaller scale
    const cardMesh = new Board3dCard(
      frontTexture,
      backTexture,
      position,
      rotation,
      1.1// Smaller size
    );

    // Ensure card is completely flat like the deck (no rotation on any axis)
    const cardGroup = cardMesh.getGroup();
    cardGroup.rotation.x = 0;
    cardGroup.rotation.y = 0;
    cardGroup.rotation.z = 0;

    // Store metadata
    cardGroup.userData.isHandCard = true;
    cardGroup.userData.handIndex = index;
    cardGroup.userData.cardData = card;

    this.handGroup.add(cardMesh.getGroup());
    this.handCards.set(index, cardMesh);
  }

  /**
   * Calculate 3D position for card in straight line
   */
  private calculateCardPosition(index: number, totalCards: number): Vector3 {
    // Center the row of cards
    const totalWidth = (totalCards - 1) * this.cardSpacing;
    const startX = -totalWidth / 2;
    const x = startX + (index * this.cardSpacing);
    const y = 0;
    const z = 0;

    return new Vector3(x, y, z);
  }

  /**
   * Clear all hand cards
   */
  private clearHand(): void {
    this.handCards.forEach(card => {
      this.handGroup.remove(card.getGroup());
      card.dispose();
    });
    this.handCards.clear();
  }

  /**
   * Remove a specific card by index (after it's played)
   */
  removeCard(index: number): void {
    const card = this.handCards.get(index);
    if (card) {
      this.handGroup.remove(card.getGroup());
      card.dispose();
      this.handCards.delete(index);
    }
  }

  /**
   * Get hand group for adding to scene
   */
  getHandGroup(): Group {
    return this.handGroup;
  }

  /**
   * Get card at hand index
   */
  getCardAtIndex(index: number): Board3dCard | undefined {
    return this.handCards.get(index);
  }

  /**
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    this.clearHand();
    scene.remove(this.handGroup);
  }
}
