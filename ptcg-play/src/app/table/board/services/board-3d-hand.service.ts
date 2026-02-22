import { Injectable } from '@angular/core';
import { CardList, Card } from 'ptcg-server';
import { Vector3, Scene, Group, Camera } from 'three';
import gsap from 'gsap';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

@Injectable()
export class Board3dHandService {
  private handCards: Map<number, Board3dCard> = new Map();
  private handGroup: Group;
  private isUpdating: boolean = false;

  // Hand positioning (straight row) - positioned where old bench used to be
  private cardSpacing = 3.5;         // Space between cards (card width is ~2.75 with scale)
  private handDistance = 30;         // Z position (where old bench used to be)
  private handHeight = 0.1;          // Height in world space (just above board)

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) {
    this.handGroup = new Group();
    this.handGroup.position.set(0, this.handHeight, this.handDistance);
    // Cards flat on board surface (no tilt)
    this.handGroup.rotation.set(0, 0, 0);
  }

  /**
   * Update hand cards based on player's hand
   */
  async updateHand(
    hand: CardList,
    isOwner: boolean,
    scene: Scene,
    playableCardIds?: number[]
  ): Promise<void> {
    // Prevent concurrent updates
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    try {
      const cards = hand.cards;

      // Preload hand card textures (fire-and-forget for owner's face-up cards)
      if (isOwner && cards.length > 0) {
        const urls = cards
          .map(c => this.cardsBaseService.getScanUrlFromCardList(c, hand))
          .filter((url): url is string => !!url && !!url.trim());
        this.assetLoader.preloadCardTextures(urls);
      }

      // Ensure handGroup is in scene before operations
      if (!scene.children.includes(this.handGroup)) {
        scene.add(this.handGroup);
      }

      // Clear old cards (kills animations and properly disposes)
      this.clearHand(scene);

      // Create new cards in parallel
      const cardPromises = cards.map((card, i) => {
        const isPlayable = isOwner && playableCardIds?.includes(card.id);
        return this.createHandCard(card, i, cards.length, isOwner, isPlayable, hand);
      });
      await Promise.all(cardPromises);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Create a single hand card in arc formation
   */
  private async createHandCard(
    card: Card,
    index: number,
    totalCards: number,
    isOwner: boolean,
    isPlayable?: boolean,
    hand?: CardList
  ): Promise<void> {
    // Calculate position in straight line
    const position = this.calculateCardPosition(index, totalCards);
    const rotation = 0; // No rotation - cards face forward

    // Load texture (checks artworksMap for overrides first, like 2D components do)
    const scanUrl = this.cardsBaseService.getScanUrlFromCardList(card, hand);
    const isFaceDown = !isOwner;

    // Progressive loading: show card-back immediately, load front texture in background
    const [backTexture, maskTexture] = await Promise.all([
      this.assetLoader.loadCardBack(),
      this.assetLoader.loadCardMaskTexture()
    ]);

    let frontTexture;
    if (isFaceDown) {
      frontTexture = backTexture;
    } else {
      frontTexture = await this.assetLoader.loadCardBack();
      const needsFrontLoad = scanUrl && scanUrl.trim();
      if (needsFrontLoad) {
        this.assetLoader.loadCardTexture(scanUrl).then(loadedFront => {
          const handCard = this.handCards.get(index);
          if (handCard && handCard.getGroup().userData.cardData?.id === card.id) {
            handCard.updateTexture(loadedFront, backTexture, maskTexture);
          }
        }).catch(() => {});
      } else if (!scanUrl || !scanUrl.trim()) {
        console.warn('Empty scanUrl for hand card:', card?.fullName, 'set:', card?.set, 'setNumber:', card?.setNumber);
      }
    }

    // Create card mesh with smaller scale
    const cardMesh = new Board3dCard(
      frontTexture,
      backTexture,
      position,
      rotation,
      1.1, // Smaller size
      maskTexture
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

    // Add green outline for playable cards (matches 2D board's green-400 color)
    if (isPlayable) {
      cardMesh.setOutline(true, 0x4ade80);
    }

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
  private clearHand(scene?: Scene): void {
    this.handCards.forEach(card => {
      const cardGroup = card.getGroup();

      // Kill all animations before disposing
      gsap.killTweensOf(cardGroup.position);
      gsap.killTweensOf(cardGroup.rotation);
      gsap.killTweensOf(cardGroup.scale);

      // Check if card is actually in handGroup before removing
      if (cardGroup.parent === this.handGroup) {
        this.handGroup.remove(cardGroup);
      } else if (scene && cardGroup.parent) {
        // Card might have been moved (e.g., during drag) - remove from scene directly
        scene.remove(cardGroup);
      }

      card.dispose();
    });
    this.handCards.clear();
  }

  /**
   * Remove a specific card by index (after it's played)
   * @param index Hand index of the card to remove
   * @param scene Optional scene for fallback removal when card was moved (e.g. during drag)
   */
  removeCard(index: number, scene?: Scene): void {
    const card = this.handCards.get(index);
    if (card) {
      const cardGroup = card.getGroup();

      // Kill animations before removing
      gsap.killTweensOf(cardGroup.position);
      gsap.killTweensOf(cardGroup.rotation);
      gsap.killTweensOf(cardGroup.scale);

      // Check if card is actually in handGroup before removing
      if (cardGroup.parent === this.handGroup) {
        this.handGroup.remove(cardGroup);
      } else if (scene && cardGroup.parent) {
        // Card may have been moved (e.g. during drag) - remove from scene
        cardGroup.parent.remove(cardGroup);
      }

      card.dispose();
      this.handCards.delete(index);

      // Reposition remaining cards to re-center the hand
      this.repositionRemainingCards();
    }
  }

  /**
   * Reposition remaining cards after one is removed
   */
  private repositionRemainingCards(): void {
    const cards = Array.from(this.handCards.entries());
    const totalCards = cards.length;

    if (totalCards === 0) return;

    // Sort by current index to maintain order
    cards.sort((a, b) => a[0] - b[0]);

    // Animate each card to its new position and update indices
    const newMap = new Map<number, Board3dCard>();
    cards.forEach(([oldIndex, card], newIndex) => {
      const cardGroup = card.getGroup();

      // Ensure card is still in handGroup before repositioning
      if (cardGroup.parent !== this.handGroup) {
        // Skip cards that are not in handGroup (e.g., being dragged)
        newMap.set(newIndex, card);
        return;
      }

      // Kill existing animations before starting new ones
      gsap.killTweensOf(cardGroup.position);

      const newPosition = this.calculateCardPosition(newIndex, totalCards);

      // Animate to new position
      gsap.to(cardGroup.position, {
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z,
        duration: 0.2,
        ease: 'power2.out'
      });

      // Update the hand index in userData
      cardGroup.userData.handIndex = newIndex;

      // Add to new map with new index
      newMap.set(newIndex, card);
    });

    // Replace the old map with the new one
    this.handCards = newMap;
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
   * Dispose all resources and reset for next use
   */
  dispose(scene: Scene): void {
    this.clearHand(scene);
    if (scene.children.includes(this.handGroup)) {
      scene.remove(this.handGroup);
    }

    // Recreate handGroup for next component instance
    this.handGroup = new Group();
    this.handGroup.position.set(0, this.handHeight, this.handDistance);
    this.handGroup.rotation.set(0, 0, 0);
    this.isUpdating = false;
  }
}
