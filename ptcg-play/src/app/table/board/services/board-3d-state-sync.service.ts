import { Injectable } from '@angular/core';
import { Player, CardList, CardTarget, PlayerType, SlotType, PokemonCardList, CardTag, SuperType, Card, Stage, PokemonCard } from 'ptcg-server';
import { Vector3, Scene, PerspectiveCamera } from 'three';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
import { Board3dAnimationService } from './board-3d-animation.service';
import { Board3dCardOverlayService } from './board-3d-card-overlay.service';
import { Board3dStackService, UpdateCardCallback, GetCardByIdCallback } from './board-3d-stack.service';
import { Board3dPrizeService, RemoveCardCallback } from './board-3d-prize.service';
import { ZONE_POSITIONS, getBenchPositions } from '../board-3d/board-3d-zone-positions';

@Injectable()
export class Board3dStateSyncService {
  private cardsMap: Map<string, Board3dCard> = new Map();
  private skippedCardIdForSync: string | null = null;
  private skippedScaleCardIdForSync: string | null = null;

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService,
    private animationService: Board3dAnimationService,
    private overlayService: Board3dCardOverlayService,
    private stackService: Board3dStackService,
    private prizeService: Board3dPrizeService
  ) { }

  /**
   * Synchronize the entire game state to the 3D scene
   * @param topPlayer Optional: When provided (e.g., in replay/spectator mode with switchSide), use this player directly for top position
   * @param bottomPlayer Optional: When provided (e.g., in replay/spectator mode with switchSide), use this player directly for bottom position
   */
  async syncState(
    gameState: LocalGameState,
    scene: Scene,
    currentPlayerId: number,
    topPlayer?: Player,
    bottomPlayer?: Player,
    skippedCardId?: string | null,
    skippedScaleCardId?: string | null
  ): Promise<void> {
    if (!gameState || !gameState.state) {
      return;
    }

    this.skippedCardIdForSync = skippedCardId ?? null;
    this.skippedScaleCardIdForSync = skippedScaleCardId ?? null;
    const state = gameState.state;

    // Use provided players if available (for replay/spectator mode with switchSide)
    // Otherwise, look up players by ID (normal gameplay)
    let bottomPlayerToSync: Player | undefined;
    let topPlayerToSync: Player | undefined;

    if (topPlayer && bottomPlayer) {
      // Use provided players directly (already swapped if switchSide is true)
      bottomPlayerToSync = bottomPlayer;
      topPlayerToSync = topPlayer;
    } else {
      // Fall back to ID lookup (normal gameplay)
      bottomPlayerToSync = state.players.find(p => p.id === currentPlayerId);
      topPlayerToSync = state.players.find(p => p.id !== currentPlayerId);
    }

    // Clear old cards that no longer match the current player assignments
    this.cleanupOldCards(state, topPlayerToSync, bottomPlayerToSync, scene);

    // Preload textures for visible cards (fire-and-forget for faster display during sync)
    const preloadUrls = this.collectVisibleCardUrls(bottomPlayerToSync, topPlayerToSync, currentPlayerId, state);
    this.assetLoader.preloadCardTextures(preloadUrls);

    // Sync bottomPlayer
    if (bottomPlayerToSync) {
      // Determine isOwner: true if this is the current client's player
      const isOwner = bottomPlayerToSync.id === currentPlayerId;
      await this.syncPlayer(
        bottomPlayerToSync,
        'bottomPlayer',
        isOwner,
        scene
      );
    }

    // Sync topPlayer
    if (topPlayerToSync) {
      // Determine isOwner: true if this is the current client's player
      const isOwner = topPlayerToSync.id === currentPlayerId;
      await this.syncPlayer(
        topPlayerToSync,
        'topPlayer',
        isOwner,
        scene
      );
    }

    // Sync shared stadium (only once - stadium is shared between both players)
    // Find the stadium CardList that actually has cards (only one player will have cards at a time)
    const stadium = state.players.find(p => p.stadium.cards.length > 0)?.stadium;
    if (stadium && stadium.cards.length > 0) {
      await this.updateCard(
        stadium,
        'shared_stadium',
        ZONE_POSITIONS.stadium,
        true, // Always visible
        0,    // No rotation (horizontal orientation)
        scene,
        undefined, // No cardTarget
        1.0  // Same scale as bench/supporter cards
      );

      // Mark stadium card for click detection
      const stadiumCardMesh = this.cardsMap.get('shared_stadium');
      if (stadiumCardMesh) {
        stadiumCardMesh.getGroup().userData.isStadium = true;
      }
    } else {
      this.removeCard('shared_stadium', scene);
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
    const playerType = position === 'topPlayer' ? PlayerType.TOP_PLAYER : PlayerType.BOTTOM_PLAYER;

    // Active and Supporter - run in parallel (independent zones)
    const activePromise = player.active && player.active.cards.length > 0
      ? (() => {
          const sleeveImagePath = this.getSleeveImagePath(player.active, player);
          return this.updateCard(
            player.active!,
            `${playerPrefix}_active`,
            ZONE_POSITIONS[position].active,
            isOwner,
            rotation,
            scene,
            { player: playerType, slot: SlotType.ACTIVE, index: 0 },
            1.5,
            sleeveImagePath
          );
        })()
      : Promise.resolve(undefined).then(() => {
          this.removeCard(`${playerPrefix}_active`, scene);
        });

    const supporterPromise = player.supporter && player.supporter.cards.length > 0
      ? this.updateCard(
          player.supporter,
          `${playerPrefix}_supporter`,
          ZONE_POSITIONS[position].supporter,
          isOwner,
          rotation,
          scene
        )
      : Promise.resolve(undefined).then(() => {
          this.removeCard(`${playerPrefix}_supporter`, scene);
        });

    await Promise.all([activePromise, supporterPromise]);

    // Bench Pokemon - load all in parallel
    const benchPositions = getBenchPositions(player.bench.length, playerType);
    const benchPromises = player.bench.map((benchCard, i) => {
      const cardId = `${playerPrefix}_bench_${i}`;
      if (benchCard && benchCard.cards.length > 0) {
        const sleeveImagePath = this.getSleeveImagePath(benchCard, player);
        return this.updateCard(
          benchCard,
          cardId,
          benchPositions[i],
          isOwner,
          rotation,
          scene,
          { player: playerType, slot: SlotType.BENCH, index: i },
          1.0,
          sleeveImagePath
        );
      } else {
        this.removeCard(cardId, scene);
        return Promise.resolve();
      }
    });
    await Promise.all(benchPromises);

    // Deck stack
    if (player.deck && player.deck.cards.length > 0) {
      await this.stackService.updateDeckStack(
        `${playerPrefix}_deck`,
        player.deck.cards.length,
        ZONE_POSITIONS[position].deck,
        rotation,
        scene,
        (player.deck as any)?.sleeveImagePath,
        player.deck,
        this.updateCard.bind(this),
        this.getCardById.bind(this)
      );
    }

    // Discard pile (stacked with latest on top)
    if (player.discard && player.discard.cards.length > 0) {
      await this.stackService.updateDiscardStack(
        player.discard,
        `${playerPrefix}_discard`,
        ZONE_POSITIONS[position].discard,
        rotation,
        scene,
        this.updateCard.bind(this),
        this.getCardById.bind(this)
      );
    } else {
      // Remove discard stack and top card
      const discardStackId = `${playerPrefix}_discard`;
      this.stackService.removeStack(discardStackId, scene, false);
      this.removeCard(`${discardStackId}_top`, scene);
    }

    // Lost Zone (stacked with latest on top)
    // if (player.lostzone && player.lostzone.cards.length > 0) {
    //   await this.stackService.updateLostZoneStack(
    //     player.lostzone,
    //     `${playerPrefix}_lostzone`,
    //     ZONE_POSITIONS[position].lostZone,
    //     rotation,
    //     scene,
    //     this.updateCard.bind(this),
    //     this.getCardById.bind(this),
    //     this.removeCard.bind(this)
    //   );
    // } else {
    //   // Remove Lost Zone stack and top card
    //   const lostZoneStackId = `${playerPrefix}_lostzone`;
    //   this.stackService.removeLostZoneStack(lostZoneStackId, scene);
    //   this.removeCard(`${lostZoneStackId}_top`, scene);
    // }

    // Prize cards (show in 2x3 grid)
    if (player.prizes) {
      await this.prizeService.updatePrizes(
        playerPrefix,
        player.prizes,
        ZONE_POSITIONS[position].prizes,
        isOwner,
        rotation,
        scene,
        player,
        this.updateCard.bind(this),
        this.removeCard.bind(this),
        this.getCardById.bind(this)
      );
    }
  }

  /**
   * Collect scan URLs for all visible face-up cards (for texture preloading)
   */
  private collectVisibleCardUrls(
    bottomPlayer: Player | undefined,
    topPlayer: Player | undefined,
    currentPlayerId: number,
    state: any
  ): string[] {
    const urls: string[] = [];
    const collectFromCardList = (cardList: CardList, isOwner: boolean) => {
      if (!cardList || !cardList.cards.length) return;
      const isFaceDown = cardList.isSecret || (!cardList.isPublic && !isOwner);
      if (isFaceDown) return;
      if (cardList instanceof PokemonCardList) {
        const main = cardList.getPokemonCard();
        const mainCard = main?.tags?.includes(CardTag.BREAK)
          ? cardList.cards.find(c => c.superType === SuperType.POKEMON && !c.tags?.includes(CardTag.BREAK)) || main
          : main || cardList.cards[0];
        if (mainCard) {
          const url = this.cardsBaseService.getScanUrlFromCardList(mainCard, cardList);
          if (url && url.trim()) urls.push(url);
        }
      } else {
        const url = this.cardsBaseService.getScanUrlFromCardList(cardList.cards[0], cardList);
        if (url && url.trim()) urls.push(url);
      }
    };

    [bottomPlayer, topPlayer].forEach(player => {
      if (!player) return;
      const isOwner = player.id === currentPlayerId;
      if (player.active) collectFromCardList(player.active, isOwner);
      if (player.supporter) collectFromCardList(player.supporter, isOwner);
      player.bench?.forEach(bench => collectFromCardList(bench, isOwner));
      if (player.discard?.cards?.length) {
        const topCard = player.discard.cards[player.discard.cards.length - 1];
        const topList = new CardList();
        topList.cards = [topCard];
        topList.isPublic = player.discard.isPublic;
        topList.isSecret = player.discard.isSecret;
        collectFromCardList(topList, true);
      }
      player.prizes?.forEach(prize => collectFromCardList(prize, isOwner));
    });

    const stadium = state?.players?.find((p: Player) => p.stadium?.cards?.length > 0)?.stadium;
    if (stadium?.cards?.length) collectFromCardList(stadium, true);

    return urls;
  }

  /**
   * Extract sleeve image path from CardList with fallback to player's sleeve
   */
  private getSleeveImagePath(cardList: CardList | undefined, player: Player): string | undefined {
    const cardListSleeve = (cardList as any)?.sleeveImagePath;
    const playerSleeve = (player as any)?.sleeveImagePath;
    return cardListSleeve || playerSleeve;
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
    scene: Scene,
    cardTarget?: CardTarget,
    scale: number = 1.0,
    sleeveImagePath?: string
  ): Promise<void> {
    // Determine the main card to display
    let mainCard: Card;
    let breakCard: Card | undefined;

    // Handle PokemonCardList for evolution display
    if (cardList instanceof PokemonCardList) {
      const pokemonCard = cardList.getPokemonCard();
      if (pokemonCard?.tags?.includes(CardTag.BREAK)) {
        // BREAK card: show pre-evolution as main, BREAK as overlay
        mainCard = cardList.cards.find(c =>
          c.superType === SuperType.POKEMON && !c.tags?.includes(CardTag.BREAK)
        ) || pokemonCard;
        breakCard = pokemonCard;
      } else {
        mainCard = pokemonCard || cardList.cards[0];
      }
    } else {
      mainCard = cardList.cards[0];
    }

    if (!mainCard) return;

    // Determine if card should be face-down (not public or is secret)
    const isFaceDown = cardList.isSecret || (!cardList.isPublic && !isOwner);

    // Get card scan URL (checks artworksMap for overrides first, like 2D components do)
    const scanUrl = this.cardsBaseService.getScanUrlFromCardList(mainCard, cardList);

    // Get sleeve URL if sleeve image path is provided
    const sleeveUrl = sleeveImagePath ? this.cardsBaseService.getSleeveUrl(sleeveImagePath) : undefined;

    // Load textures - use sleeve if available, otherwise use cardback
    const loadBackTexture = async () => {
      if (sleeveUrl) {
        return this.assetLoader.loadSleeveTexture(sleeveUrl);
      }
      return this.assetLoader.loadCardBack();
    };

    // Progressive loading: show card-back immediately, load front texture in background
    const [backTexture, maskTexture] = await Promise.all([
      loadBackTexture(),
      this.assetLoader.loadCardMaskTexture()
    ]);

    // Use card-back as front placeholder for face-up cards (will swap when loaded)
    const placeholderFrontTexture = await this.assetLoader.loadCardBack();
    let frontTexture = placeholderFrontTexture;

    if (isFaceDown) {
      frontTexture = backTexture;
    } else {
      const needsFrontLoad = scanUrl && scanUrl.trim();
      if (needsFrontLoad) {
        // Load front texture in background - will swap when ready
        this.assetLoader.loadCardTexture(scanUrl).then(loadedFront => {
          const currentCard = this.cardsMap.get(cardId);
          if (currentCard && currentCard.getGroup().userData.cardData?.id === mainCard.id) {
            currentCard.updateTexture(loadedFront, backTexture, maskTexture);
          }
        }).catch(() => {
          // Fallback already shown (card-back)
        });
      } else {
        console.warn('Empty scanUrl for card:', mainCard?.fullName, 'set:', mainCard?.set, 'setNumber:', mainCard?.setNumber);
      }
    }

    // Check if card already exists
    let cardMesh = this.cardsMap.get(cardId);

    if (cardMesh) {
      // Update existing card (skip position/rotation/scale if this card is being dragged)
      cardMesh.updateTexture(frontTexture, backTexture, maskTexture);
      if (cardId !== this.skippedCardIdForSync) {
        cardMesh.setPosition(position);
        cardMesh.setRotation(rotation);
      }
      if (cardId !== this.skippedCardIdForSync && cardId !== this.skippedScaleCardIdForSync) {
        cardMesh.setScale(scale);
      }
      // Update userData with latest cardList
      cardMesh.getGroup().userData.cardData = mainCard;
      cardMesh.getGroup().userData.cardList = cardList;
    } else {
      // Create new card
      cardMesh = new Board3dCard(
        frontTexture,
        backTexture,
        position,
        rotation,
        scale,
        maskTexture
      );

      cardMesh.getGroup().userData.cardId = cardId;
      cardMesh.getGroup().userData.cardData = mainCard;
      cardMesh.getGroup().userData.cardList = cardList;
      cardMesh.getGroup().userData.isBoardCard = true;
      if (cardTarget) {
        cardMesh.getGroup().userData.cardTarget = cardTarget;
      }

      scene.add(cardMesh.getGroup());
      this.cardsMap.set(cardId, cardMesh);
    }

    // Update overlays for PokemonCardList
    if (cardList instanceof PokemonCardList) {
      await this.overlayService.updateOverlays(cardId, cardList, cardMesh, breakCard, isFaceDown, scene);
    } else {
      // Clear any existing overlays for non-Pokemon cards
      this.overlayService.clearOverlays(cardId, scene);
    }
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

    // Also clean up overlays
    this.overlayService.clearOverlays(cardId, scene);
  }

  /**
   * Clean up cards that no longer match the current player assignments
   * Removes cards, stacks, and prizes for players that are no longer in the current positions
   */
  private cleanupOldCards(
    state: any,
    topPlayerToSync: Player | undefined,
    bottomPlayerToSync: Player | undefined,
    scene: Scene
  ): void {
    // Build map of expected positions for each player ID
    // This ensures we check both player ID validity AND position correctness
    const expectedPositions = new Map<number, 'topPlayer' | 'bottomPlayer'>();
    if (topPlayerToSync) {
      expectedPositions.set(topPlayerToSync.id, 'topPlayer');
    }
    if (bottomPlayerToSync) {
      expectedPositions.set(bottomPlayerToSync.id, 'bottomPlayer');
    }

    // If no valid players, clear everything except stadium
    if (expectedPositions.size === 0) {
      // Clear all cards except stadium
      const cardsToRemove: string[] = [];
      this.cardsMap.forEach((card, cardId) => {
        if (cardId !== 'shared_stadium') {
          cardsToRemove.push(cardId);
        }
      });
      cardsToRemove.forEach(cardId => this.removeCard(cardId, scene));

      // Clear all stacks (no valid players, so remove everything)
      const allStacksToRemove: Array<{ stackId: string; isDeck: boolean }> = [];
      (this.stackService as any).deckStacks?.forEach((stack: any, stackId: string) => {
        allStacksToRemove.push({ stackId, isDeck: true });
      });
      (this.stackService as any).discardStacks?.forEach((stack: any, stackId: string) => {
        allStacksToRemove.push({ stackId, isDeck: false });
      });
      allStacksToRemove.forEach(({ stackId, isDeck }) => {
        this.stackService.removeStack(stackId, scene, isDeck);
      });
      return;
    }

    // Remove cards that don't match current player assignments
    // Card IDs are formatted as: ${position}_${playerId}_${slot}
    // Examples: bottomPlayer_1_active, topPlayer_2_bench_0, bottomPlayer_1_deck
    const cardsToRemove: string[] = [];
    this.cardsMap.forEach((card, cardId) => {
      // Skip stadium (it's shared)
      if (cardId === 'shared_stadium') {
        return;
      }

      // Extract player ID and position from card ID
      // Format: position_playerId_slot or position_playerId_slot_index
      const parts = cardId.split('_');
      if (parts.length >= 3) {
        const position = parts[0] as 'topPlayer' | 'bottomPlayer';
        const playerIdStr = parts[1];
        const playerId = parseInt(playerIdStr, 10);

        if (!isNaN(playerId)) {
          const expectedPosition = expectedPositions.get(playerId);
          // Remove if player ID doesn't exist OR position doesn't match expected position
          if (!expectedPosition || expectedPosition !== position) {
            cardsToRemove.push(cardId);
          }
        }
      }
    });

    // Remove cards that don't match
    cardsToRemove.forEach(cardId => this.removeCard(cardId, scene));

    // Clean up stacks (deck/discard) for removed players or wrong positions
    // Stack IDs are formatted as: ${position}_${playerId}_deck or ${position}_${playerId}_discard
    const stacksToRemove: Array<{ stackId: string; isDeck: boolean }> = [];

    // Check deck stacks
    (this.stackService as any).deckStacks?.forEach((stack: any, stackId: string) => {
      const parts = stackId.split('_');
      if (parts.length >= 3) {
        const position = parts[0] as 'topPlayer' | 'bottomPlayer';
        const playerIdStr = parts[1];
        const playerId = parseInt(playerIdStr, 10);
        if (!isNaN(playerId)) {
          const expectedPosition = expectedPositions.get(playerId);
          // Remove if player ID doesn't exist OR position doesn't match expected position
          if (!expectedPosition || expectedPosition !== position) {
            stacksToRemove.push({ stackId, isDeck: true });
          }
        }
      }
    });

    // Check discard stacks
    (this.stackService as any).discardStacks?.forEach((stack: any, stackId: string) => {
      const parts = stackId.split('_');
      if (parts.length >= 3) {
        const position = parts[0] as 'topPlayer' | 'bottomPlayer';
        const playerIdStr = parts[1];
        const playerId = parseInt(playerIdStr, 10);
        if (!isNaN(playerId)) {
          const expectedPosition = expectedPositions.get(playerId);
          // Remove if player ID doesn't exist OR position doesn't match expected position
          if (!expectedPosition || expectedPosition !== position) {
            stacksToRemove.push({ stackId, isDeck: false });
          }
        }
      }
    });

    // Remove stacks for removed players or wrong positions
    stacksToRemove.forEach(({ stackId, isDeck }) => {
      this.stackService.removeStack(stackId, scene, isDeck);
    });
  }

  /**
   * Get a card mesh by ID
   */
  getCardById(cardId: string): Board3dCard | undefined {
    return this.cardsMap.get(cardId);
  }

  /**
   * Update all energy sprites to face the camera (billboard behavior).
   * Call each frame before rendering.
   */
  updateBillboards(camera: PerspectiveCamera): void {
    this.overlayService.updateBillboards(camera);
  }

  /**
   * Update selection outlines for all board cards based on BoardInteractionService state
   */
  updateSelectionState(
    isSelectionMode: boolean,
    interactionService: BoardInteractionService
  ): void {
    this.cardsMap.forEach((card, cardId) => {
      const userData = card.getGroup().userData;
      const cardTarget = userData.cardTarget as CardTarget;

      // Skip cards without a cardTarget (deck, discard, stadium, etc.)
      if (!cardTarget) {
        card.setOutline(false);
        return;
      }

      if (isSelectionMode) {
        const isEligible = interactionService.isTargetEligible(cardTarget);
        const isSelected = interactionService.isTargetSelected(cardTarget);

        if (isSelected) {
          card.setOutline(true, 0x4ade80); // Green for selected
        } else if (isEligible) {
          card.setOutline(true, 0xffffff); // White for selectable
        } else {
          card.setOutline(false);
        }
      } else {
        card.setOutline(false);
      }
    });
  }

  /**
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    // Clean up overlays
    this.overlayService.dispose(scene);

    // Clean up stacks
    this.stackService.dispose(scene);

    // Clean up prizes (minimal - uses cardsMap)
    this.prizeService.dispose(scene);

    // Clean up cards
    this.cardsMap.forEach(card => {
      scene.remove(card.getGroup());
      card.dispose();
    });
    this.cardsMap.clear();
  }
}
