import { CardList, Card } from 'ptcg-server';
import { Vector3, Group, Object3D, type Texture } from 'three';
import gsap from 'gsap';
import { Board3dCard } from '../board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import type { Board3dCardsAdapter } from '../board3dCardsAdapter';
import { apply3dCardHolo } from '../board-3d-holo-apply';
import type { Board3dHandSlotSnapshot } from '../board3dSceneModel';

export type PrepareDrawFlightResult = {
  flyingCard: Object3D;
  handSlotWorld: Vector3;
};

export class Board3dHandService {
  private handCards: Map<number, Board3dCard> = new Map();
  private handGroup: Group;
  private isUpdating: boolean = false;
  /** When true, hand card groups are parented via R3F (portal); defer dispose until drain. */
  private r3fDeclarativeHand = false;
  private pendingR3fHandDisposals: Board3dCard[] = [];
  /** When >0, multi-draw prepare steps run; keeps {@link isUpdating} true for the whole sequence. */
  private batchDrawPrepareDepth: number = 0;

  // Hand positioning (straight row) - positioned where old bench used to be
  private cardSpacing = 3.5;         // Space between cards (card width is ~2.75 with scale)
  private handDistance = 30;         // Z position (where old bench used to be)
  private handHeight = 0.1;          // Height in world space (just above board)

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsAdapter: Board3dCardsAdapter
  ) {
    this.handGroup = new Group();
    this.handGroup.position.set(0, this.handHeight, this.handDistance);
    // Cards flat on board surface (no tilt)
    this.handGroup.rotation.set(0, 0, 0);
  }

  setR3fDeclarativeHand(enabled: boolean): void {
    this.r3fDeclarativeHand = enabled;
  }

  drainPendingR3fHandDisposals(): void {
    if (this.pendingR3fHandDisposals.length === 0) {
      return;
    }
    for (const card of this.pendingR3fHandDisposals) {
      card.dispose();
    }
    this.pendingR3fHandDisposals = [];
  }

  /**
   * Update hand cards based on player's hand
   */
  async updateHand(
    hand: CardList,
    isOwner: boolean,
    attachRoot: Object3D,
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
          .map(c => this.cardsAdapter.getScanUrlFor3D(c, hand))
          .filter((url): url is string => !!url && !!url.trim());
        this.assetLoader.preloadCardTextures(urls);
      }

      // Ensure handGroup is attached before operations
      if (!attachRoot.children.includes(this.handGroup)) {
        attachRoot.add(this.handGroup);
      }

      // Clear old cards (kills animations and properly disposes)
      this.clearHand(attachRoot);

      // Create new cards in parallel
      const cardPromises = cards.map((card, i) => {
        const isPlayable = isOwner && playableCardIds?.includes(card.id);
        return this.createHandCard(card, i, cards.length, isOwner, isPlayable, hand, false);
      });
      await Promise.all(cardPromises);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Rebuild hand, then detach the last card to the scene at the deck (world) for a draw flight animation.
   */
  async updateHandPrepareDrawFlight(
    hand: CardList,
    isOwner: boolean,
    handSlot: Object3D,
    worldAttachRoot: Object3D,
    deckWorldPosition: Vector3,
    playableCardIds?: number[]
  ): Promise<PrepareDrawFlightResult | null> {
    if (this.isUpdating) {
      return null;
    }

    const cards = hand.cards;
    if (cards.length === 0) {
      return null;
    }

    this.isUpdating = true;

    try {
      if (isOwner && cards.length > 0) {
        const urls = cards
          .map(c => this.cardsAdapter.getScanUrlFor3D(c, hand))
          .filter((url): url is string => !!url && !!url.trim());
        this.assetLoader.preloadCardTextures(urls);
      }

      if (!handSlot.children.includes(this.handGroup)) {
        handSlot.add(this.handGroup);
      }

      this.clearHand(handSlot);

      const cardPromises = cards.map((card, i) => {
        const isPlayable = isOwner && playableCardIds?.includes(card.id);
        const deferFront = i === cards.length - 1;
        return this.createHandCard(card, i, cards.length, isOwner, isPlayable, hand, deferFront);
      });
      await Promise.all(cardPromises);

      const lastIdx = cards.length - 1;
      const board3dCard = this.handCards.get(lastIdx);
      if (!board3dCard) {
        return null;
      }

      const cardGroup = board3dCard.getGroup();
      const lastCard = cards[lastIdx];
      const scanUrl = this.cardsAdapter.getScanUrlFor3D(lastCard, hand);
      const [backForDeck, maskForDeck] = await Promise.all([
        this.assetLoader.loadCardBack(),
        this.assetLoader.loadCardMaskTexture()
      ]);
      let revealFrontTexture = backForDeck;
      if (isOwner && scanUrl?.trim()) {
        try {
          revealFrontTexture = await this.assetLoader.loadCardTexture(scanUrl);
        } catch {
          revealFrontTexture = backForDeck;
        }
      }

      // Deck-style face-down: same as board deck top (rotation 0, both faces card back).
      board3dCard.updateTexture(backForDeck, backForDeck, maskForDeck);
      cardGroup.userData.drawRevealFrontTexture = revealFrontTexture;
      cardGroup.userData.drawRevealBackTexture = backForDeck;
      cardGroup.userData.drawRevealMaskTexture = maskForDeck;
      cardGroup.userData.drawBoard3dCard = board3dCard;

      worldAttachRoot.attach(cardGroup);
      cardGroup.position.copy(deckWorldPosition);
      cardGroup.rotation.set(0, 0, 0);
      cardGroup.quaternion.identity();
      cardGroup.scale.set(1.1, 1.1, 1.1);
      cardGroup.userData.drawingFromDeck = true;

      const localSlot = this.calculateCardPosition(lastIdx, cards.length);
      const handSlotWorld = localSlot.clone();
      this.handGroup.localToWorld(handSlotWorld);

      return { flyingCard: cardGroup, handSlotWorld };
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Re-attach the flying card into the hand group and snap it to its slot (call after draw animation ends).
   */
  /**
   * At the edge-on midpoint of a Z-axis flip: put the scan on the mesh "back" material so the second half of the turn
   * exposes the card face (material slots are fixed; which side faces the camera changes with rotation).
   */
  revealDrawFlightFace(cardGroup: Object3D): void {
    const bc = cardGroup.userData.drawBoard3dCard as Board3dCard | undefined;
    const scan = cardGroup.userData.drawRevealFrontTexture;
    const cardBack = cardGroup.userData.drawRevealBackTexture;
    const mask = cardGroup.userData.drawRevealMaskTexture;
    if (bc && scan && cardBack !== undefined && mask !== undefined) {
      bc.updateTexture(cardBack, scan, mask);
      bc.setHolo(null);
    }
  }

  finishDrawFlight(cardGroup: Object3D, totalHandCards?: number): void {
    const bc = cardGroup.userData.drawBoard3dCard as Board3dCard | undefined;
    const front = cardGroup.userData.drawRevealFrontTexture;
    const back = cardGroup.userData.drawRevealBackTexture;
    const mask = cardGroup.userData.drawRevealMaskTexture;

    delete cardGroup.userData.drawingFromDeck;
    delete cardGroup.userData.drawRevealFrontTexture;
    delete cardGroup.userData.drawRevealBackTexture;
    delete cardGroup.userData.drawRevealMaskTexture;
    delete cardGroup.userData.drawBoard3dCard;

    const idx = cardGroup.userData.handIndex as number | undefined;
    const total = totalHandCards ?? this.handCards.size;
    if (idx === undefined || idx < 0 || total === 0) {
      return;
    }
    this.handGroup.attach(cardGroup);
    const pos = this.calculateCardPosition(idx, total);
    cardGroup.position.copy(pos);
    cardGroup.rotation.set(0, 0, 0);
    cardGroup.quaternion.identity();
    cardGroup.scale.set(1.1, 1.1, 1.1);
    if (bc && front && back !== undefined && mask !== undefined) {
      bc.updateTexture(front, back, mask);
      const data = cardGroup.userData.cardData as Card | undefined;
      if (data) {
        void apply3dCardHolo(this.assetLoader, bc, data, false);
      }
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
    hand?: CardList,
    deferProgressiveFrontLoad = false,
    addToHandGroup = true
  ): Promise<void> {
    // Calculate position in straight line
    const position = this.calculateCardPosition(index, totalCards);
    const rotation = 0; // No rotation - cards face forward

    // Load texture (checks artworksMap for overrides first, like 2D components do)
    const scanUrl = this.cardsAdapter.getScanUrlFor3D(card, hand);
    const isFaceDown = !isOwner;
    const hasScan = !!(scanUrl && scanUrl.trim());

    // Progressive loading: show card-back immediately, load front texture in background
    const [backTexture, maskTexture] = await Promise.all([
      this.assetLoader.loadCardBack(),
      this.assetLoader.loadCardMaskTexture()
    ]);

    let frontTexture: Texture;
    let awaitingHandScan = false;
    if (isFaceDown) {
      frontTexture = backTexture;
    } else {
      const placeholder = await this.assetLoader.loadCardBack();
      if (hasScan && !deferProgressiveFrontLoad) {
        const cached = this.assetLoader.getCardTextureIfCached(scanUrl);
        if (cached) {
          frontTexture = cached;
        } else {
          frontTexture = placeholder;
          awaitingHandScan = true;
          this.assetLoader.loadCardTexture(scanUrl).then(loadedFront => {
            const handCard = this.handCards.get(index);
            if (handCard && handCard.getGroup().userData.cardData?.id === card.id) {
              handCard.updateTexture(loadedFront, backTexture, maskTexture);
              void apply3dCardHolo(this.assetLoader, handCard, card, false);
            }
          }).catch(() => { });
        }
      } else {
        frontTexture = placeholder;
        if (!hasScan) {
          console.warn('Empty scanUrl for hand card:', card?.fullName, 'set:', card?.set, 'setNumber:', card?.setNumber);
        }
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

    if (addToHandGroup && !this.r3fDeclarativeHand) {
      this.handGroup.add(cardMesh.getGroup());
    }
    this.handCards.set(index, cardMesh);

    if (isFaceDown) {
      void apply3dCardHolo(this.assetLoader, cardMesh, card, true);
    } else if (awaitingHandScan || (hasScan && deferProgressiveFrontLoad)) {
      cardMesh.setHolo(null);
    } else if (hasScan) {
      void apply3dCardHolo(this.assetLoader, cardMesh, card, false);
    } else {
      void apply3dCardHolo(this.assetLoader, cardMesh, card, true);
    }
  }

  /**
   * World position for a hand slot (final layout uses full hand size).
   */
  getHandSlotWorld(index: number, totalCards: number): Vector3 {
    const local = this.calculateCardPosition(index, totalCards);
    const w = local.clone();
    this.handGroup.localToWorld(w);
    return w;
  }

  /**
   * Multi-draw: rebuild the stable prefix (indices0..stablePrefixLen-1) on the first step only,
   * then peel one flying card per step at indices stablePrefixLen+stepIndex.
   * Earlier steps leave cards on the scene at stage positions; do not call clearHand between steps.
   * @param flightOriginWorld Deck top or prize slot world position for this card.
   */
  /**
   * Begin a multi-draw flight sequence. Call {@link endBatchDrawPrepare} in a `finally` block.
   * @returns false if another exclusive hand mutation is already in progress.
   */
  beginBatchDrawPrepare(): boolean {
    if (this.isUpdating && this.batchDrawPrepareDepth === 0) {
      return false;
    }
    this.batchDrawPrepareDepth++;
    if (this.batchDrawPrepareDepth === 1) {
      this.isUpdating = true;
    }
    return true;
  }

  endBatchDrawPrepare(): void {
    if (this.batchDrawPrepareDepth <= 0) {
      return;
    }
    this.batchDrawPrepareDepth--;
    if (this.batchDrawPrepareDepth === 0) {
      this.isUpdating = false;
    }
  }

  async prepareBatchDrawFlightStep(
    hand: CardList,
    isOwner: boolean,
    handSlot: Object3D,
    worldAttachRoot: Object3D,
    flightOriginWorld: Vector3,
    playableCardIds: number[] | undefined,
    stablePrefixLen: number,
    stepIndex: number,
    isFirstStep: boolean,
    flyCardId?: number
  ): Promise<PrepareDrawFlightResult | null> {
    if (this.batchDrawPrepareDepth === 0) {
      return null;
    }
    const cards = hand.cards;
    if (cards.length === 0) {
      return null;
    }
    let flyIdx = stablePrefixLen + stepIndex;
    if (flyCardId !== undefined) {
      const idIdx = cards.findIndex(c => c.id === flyCardId);
      if (idIdx >= 0) {
        flyIdx = idIdx;
      }
    }
    if (flyIdx < 0 || flyIdx >= cards.length) {
      return null;
    }

    if (isFirstStep) {
      if (isOwner && cards.length > 0) {
        const urls = cards
          .map(c => this.cardsAdapter.getScanUrlFor3D(c, hand))
          .filter((url): url is string => !!url && !!url.trim());
        this.assetLoader.preloadCardTextures(urls);
      }

      if (!handSlot.children.includes(this.handGroup)) {
        handSlot.add(this.handGroup);
      }

      this.clearHand(handSlot);

      for (let j = 0; j < flyIdx; j++) {
        const isPlayable = isOwner && playableCardIds?.includes(cards[j].id);
        await this.createHandCard(cards[j], j, cards.length, isOwner, isPlayable, hand, false);
      }
    } else {
      if (!handSlot.children.includes(this.handGroup)) {
        handSlot.add(this.handGroup);
      }
    }

    const flyCard = cards[flyIdx];
    const isPlayableFly = isOwner && playableCardIds?.includes(flyCard.id);
    await this.createHandCard(
      flyCard,
      flyIdx,
      cards.length,
      isOwner,
      isPlayableFly,
      hand,
      true,
      false
    );

    const board3dCard = this.handCards.get(flyIdx);
    if (!board3dCard) {
      return null;
    }

    const cardGroup = board3dCard.getGroup();
    const scanUrl = this.cardsAdapter.getScanUrlFor3D(flyCard, hand);
    const [backForDeck, maskForDeck] = await Promise.all([
      this.assetLoader.loadCardBack(),
      this.assetLoader.loadCardMaskTexture()
    ]);
    let revealFrontTexture = backForDeck;
    if (isOwner && scanUrl?.trim()) {
      try {
        revealFrontTexture = await this.assetLoader.loadCardTexture(scanUrl);
      } catch {
        revealFrontTexture = backForDeck;
      }
    }

    board3dCard.updateTexture(backForDeck, backForDeck, maskForDeck);
    cardGroup.userData.drawRevealFrontTexture = revealFrontTexture;
    cardGroup.userData.drawRevealBackTexture = backForDeck;
    cardGroup.userData.drawRevealMaskTexture = maskForDeck;
    cardGroup.userData.drawBoard3dCard = board3dCard;

    worldAttachRoot.attach(cardGroup);
    cardGroup.position.copy(flightOriginWorld);
    cardGroup.rotation.set(0, 0, 0);
    cardGroup.quaternion.identity();
    cardGroup.scale.set(1.1, 1.1, 1.1);
    cardGroup.userData.drawingFromDeck = true;

    const handSlotWorld = this.getHandSlotWorld(flyIdx, cards.length);

    return { flyingCard: cardGroup, handSlotWorld };
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
  private clearHand(_attachRoot?: Object3D): void {
    if (this.r3fDeclarativeHand) {
      this.handCards.forEach(card => {
        const cardGroup = card.getGroup();
        gsap.killTweensOf(cardGroup.position);
        gsap.killTweensOf(cardGroup.rotation);
        gsap.killTweensOf(cardGroup.scale);
        this.pendingR3fHandDisposals.push(card);
      });
      this.handCards.clear();
      return;
    }

    this.handCards.forEach(card => {
      const cardGroup = card.getGroup();

      // Kill all animations before disposing
      gsap.killTweensOf(cardGroup.position);
      gsap.killTweensOf(cardGroup.rotation);
      gsap.killTweensOf(cardGroup.scale);

      // Check if card is actually in handGroup before removing
      if (cardGroup.parent === this.handGroup) {
        this.handGroup.remove(cardGroup);
      } else if (cardGroup.parent) {
        cardGroup.removeFromParent();
      }

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
      const cardGroup = card.getGroup();

      // Kill animations before removing
      gsap.killTweensOf(cardGroup.position);
      gsap.killTweensOf(cardGroup.rotation);
      gsap.killTweensOf(cardGroup.scale);

      // Check if card is actually in handGroup before removing
      if (cardGroup.parent === this.handGroup) {
        this.handGroup.remove(cardGroup);
      } else if (cardGroup.parent) {
        cardGroup.parent.remove(cardGroup);
      }

      if (this.r3fDeclarativeHand) {
        this.pendingR3fHandDisposals.push(card);
      } else {
        card.dispose();
      }
      this.handCards.delete(index);

      // Reposition remaining cards to re-center the hand
      this.repositionRemainingCards();
    }
  }

  /**
   * Detach a hand card to the scene for a play animation without disposing it.
   * Caller must dispose the Board3dCard after the animation (or on play failure, call syncHand).
   */
  detachCardForBoardPlay(index: number, attachRoot: Object3D): Board3dCard | null {
    const board3d = this.handCards.get(index);
    if (!board3d) {
      return null;
    }
    const cardGroup = board3d.getGroup();

    gsap.killTweensOf(cardGroup.position);
    gsap.killTweensOf(cardGroup.rotation);
    gsap.killTweensOf(cardGroup.scale);

    attachRoot.attach(cardGroup);
    cardGroup.userData.isHandCard = false;
    cardGroup.userData.playingToBoard = true;
    delete cardGroup.userData.handIndex;

    this.handCards.delete(index);
    this.repositionRemainingCards();
    return board3d;
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

  getHandSlotSnapshots(): Board3dHandSlotSnapshot[] {
    return Array.from(this.handCards.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([handIndex, bridgeRef]) => ({
        handIndex,
        cardId: bridgeRef.getGroup().userData.cardData?.id,
        bridgeRef,
      }));
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
  dispose(attachRoot: Object3D): void {
    this.clearHand(attachRoot);
    this.drainPendingR3fHandDisposals();
    if (attachRoot.children.includes(this.handGroup)) {
      attachRoot.remove(this.handGroup);
    }

    // Recreate handGroup for next component instance
    this.handGroup = new Group();
    this.handGroup.position.set(0, this.handHeight, this.handDistance);
    this.handGroup.rotation.set(0, 0, 0);
    this.batchDrawPrepareDepth = 0;
    this.isUpdating = false;
  }
}
