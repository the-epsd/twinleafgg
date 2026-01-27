import { Injectable } from '@angular/core';
import { Player, CardList, CardTarget, PlayerType, SlotType, PokemonCardList, CardTag, SuperType, Card, Stage, PokemonCard } from 'ptcg-server';
import { Vector3, Scene } from 'three';
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

    // Determine which player is the current client and which is the opponent
    const currentClientPlayer = state.players.find(p => p.id === currentPlayerId);
    const opponentPlayer = state.players.find(p => p.id !== currentPlayerId);

    // Sync current client as bottomPlayer (their own view)
    if (currentClientPlayer) {
      await this.syncPlayer(
        currentClientPlayer,
        'bottomPlayer',
        true, // isOwner is always true for current client
        scene
      );
    }

    // Sync opponent as topPlayer
    if (opponentPlayer) {
      await this.syncPlayer(
        opponentPlayer,
        'topPlayer',
        false, // isOwner is always false for opponent
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
        1.5  // Same scale as Active Pokemon
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

    // Active Pokemon - 1.5x larger
    if (player.active && player.active.cards.length > 0) {
      const sleeveImagePath = this.getSleeveImagePath(player.active, player);
      await this.updateCard(
        player.active,
        `${playerPrefix}_active`,
        ZONE_POSITIONS[position].active,
        isOwner,
        rotation,
        scene,
        { player: playerType, slot: SlotType.ACTIVE, index: 0 },
        1.5,
        sleeveImagePath
      );
    } else {
      this.removeCard(`${playerPrefix}_active`, scene);
    }

    // Supporter card
    if (player.supporter && player.supporter.cards.length > 0) {
      await this.updateCard(
        player.supporter,
        `${playerPrefix}_supporter`,
        ZONE_POSITIONS[position].supporter,
        isOwner,
        rotation,
        scene
      );
    } else {
      this.removeCard(`${playerPrefix}_supporter`, scene);
    }

    // Bench Pokemon - normal size
    // Get dynamic bench positions based on bench size
    const benchPositions = getBenchPositions(player.bench.length, playerType);

    for (let i = 0; i < player.bench.length; i++) {
      const benchCard = player.bench[i];
      const cardId = `${playerPrefix}_bench_${i}`;

      if (benchCard && benchCard.cards.length > 0) {
        const sleeveImagePath = this.getSleeveImagePath(benchCard, player);
        await this.updateCard(
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
      }
    }

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

    // Stadium is now shared - synced separately in syncState()

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

    // Get card scan URL
    const scanUrl = this.cardsBaseService.getScanUrl(mainCard);

    // Get sleeve URL if sleeve image path is provided
    const sleeveUrl = sleeveImagePath ? this.cardsBaseService.getSleeveUrl(sleeveImagePath) : undefined;

    // Load textures - use sleeve if available, otherwise use cardback
    const loadBackTexture = async () => {
      if (sleeveUrl) {
        return this.assetLoader.loadSleeveTexture(sleeveUrl);
      }
      return this.assetLoader.loadCardBack();
    };

    const [frontTexture, backTexture] = await Promise.all([
      isFaceDown
        ? loadBackTexture()
        : this.assetLoader.loadCardTexture(scanUrl),
      loadBackTexture()
    ]);

    // Check if card already exists
    let cardMesh = this.cardsMap.get(cardId);

    if (cardMesh) {
      // Update existing card
      cardMesh.updateTexture(frontTexture, backTexture);
      cardMesh.setPosition(position);
      cardMesh.setRotation(rotation);
      cardMesh.setScale(scale);
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
        scale
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

      // Animate Basic Pokemon played to bench
      if (cardTarget?.slot === SlotType.BENCH &&
        mainCard.superType === SuperType.POKEMON &&
        (mainCard as PokemonCard).stage === Stage.BASIC) {
        await this.animationService.playBasicAnimation(cardMesh.getGroup());
      }
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
