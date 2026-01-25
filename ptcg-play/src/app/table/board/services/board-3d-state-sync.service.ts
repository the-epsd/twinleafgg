import { Injectable } from '@angular/core';
import { Player, CardList, CardTarget, PlayerType, SlotType, PokemonCardList, CardTag, SuperType, Card } from 'ptcg-server';
import { Vector3, Scene, Group, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Euler, Texture } from 'three';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { Board3dEnergySprite } from '../board-3d/board-3d-energy-sprite';
import { Board3dDamageCounter } from '../board-3d/board-3d-damage-counter';
import { Board3dMarker } from '../board-3d/board-3d-marker';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';

// Zone positions in 3D world space
// Layout: Stadium shared at center-left, Active near center, Bench behind Active
const ZONE_POSITIONS = {
  // Shared stadium position (single slot between both players)
  stadium: new Vector3(-10, 0.1, 15),

  bottomPlayer: {
    active: new Vector3(0, 0.1, 18),      // Moved closer to center (was Z=12)
    supporter: new Vector3(6, 0.1, 18),   // Beside Active, to the right
    bench: [
      new Vector3(-8, 0.1, 24),          // Moved to where Active was (was Z=18)
      new Vector3(-4, 0.1, 24),
      new Vector3(0, 0.1, 24),
      new Vector3(4, 0.1, 24),
      new Vector3(8, 0.1, 24),
      new Vector3(12, 0.1, 24),
      new Vector3(16, 0.1, 24),
      new Vector3(20, 0.1, 24),
    ],
    prizes: new Vector3(-18, 0.1, 20),
    deck: new Vector3(20, 0.1, 18),
    discard: new Vector3(20, 0.1, 24),
    lostZone: new Vector3(-10, 0.1, 18),
  },
  topPlayer: {
    active: new Vector3(0, 0.1, 10),     // Moved closer to center (was Z=-12)
    supporter: new Vector3(-6, 0.1, 10), // Beside Active, to the left
    bench: [
      new Vector3(8, 0.1, 4),          // Moved to where Active was (was Z=-18)
      new Vector3(4, 0.1, 4),
      new Vector3(0, 0.1, 4),
      new Vector3(-4, 0.1, 4),
      new Vector3(-8, 0.1, 4),
      new Vector3(-12, 0.1, 4),
      new Vector3(-16, 0.1, 4),
      new Vector3(-20, 0.1, 4),
    ],
    prizes: new Vector3(20, 0.1, 8),
    deck: new Vector3(-18, 0.1, 8),
    discard: new Vector3(-18, 0.1, 4),
    lostZone: new Vector3(-10, 0.1, 10),
  }
};

// Original bench positions (before shift) - used for 8-spot benches
// These extend further left/right than the current shifted positions
const ORIGINAL_BENCH_POSITIONS = {
  bottomPlayer: [
    new Vector3(-12, 0.1, 22),
    new Vector3(-8, 0.1, 22),
    new Vector3(-4, 0.1, 22),
    new Vector3(0, 0.1, 22),
    new Vector3(4, 0.1, 22),
    new Vector3(8, 0.1, 22),
    new Vector3(12, 0.1, 22),
    new Vector3(16, 0.1, 22),
  ],
  topPlayer: [
    new Vector3(12, 0.1, -4),
    new Vector3(8, 0.1, -4),
    new Vector3(4, 0.1, -4),
    new Vector3(0, 0.1, -4),
    new Vector3(-4, 0.1, -4),
    new Vector3(-8, 0.1, -4),
    new Vector3(-12, 0.1, -4),
    new Vector3(-16, 0.1, -4),
  ]
};

/**
 * Get bench positions based on bench size
 * - 5 spots: Use current shifted positions (centered, first 5)
 * - 8 spots: Use original positions (extends further left/right)
 */
function getBenchPositions(benchSize: number, playerType: PlayerType): Vector3[] {
  if (benchSize === 8) {
    // Use original positions for 8-spot benches
    return playerType === PlayerType.BOTTOM_PLAYER
      ? ORIGINAL_BENCH_POSITIONS.bottomPlayer
      : ORIGINAL_BENCH_POSITIONS.topPlayer;
  } else {
    // Use first 5 positions from current shifted array (centered)
    const currentPositions = playerType === PlayerType.BOTTOM_PLAYER
      ? ZONE_POSITIONS.bottomPlayer.bench
      : ZONE_POSITIONS.topPlayer.bench;
    return currentPositions.slice(0, benchSize);
  }
}

// Card overlay data for tracking energies, damage, markers per card
interface CardOverlays {
  energySprite: Board3dEnergySprite;
  damageCounter: Board3dDamageCounter;
  marker: Board3dMarker;
  breakCard?: Board3dCard;
  toolCards: Board3dCard[];
}

@Injectable()
export class Board3dStateSyncService {
  private cardsMap: Map<string, Board3dCard> = new Map();
  private cardOverlays: Map<string, CardOverlays> = new Map();
  private deckStacks: Map<string, InstancedMesh> = new Map();
  private energyTextureCache: Map<string, Texture> = new Map();

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
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
    const stadium = state.players[0]?.stadium || state.players[1]?.stadium;
    if (stadium && stadium.cards.length > 0) {
      await this.updateCard(
        stadium,
        'shared_stadium',
        ZONE_POSITIONS.stadium,
        true, // Always visible
        0,    // No rotation (horizontal orientation)
        scene
      );
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
      await this.updateCard(
        player.active,
        `${playerPrefix}_active`,
        ZONE_POSITIONS[position].active,
        isOwner,
        rotation,
        scene,
        { player: playerType, slot: SlotType.ACTIVE, index: 0 },
        1.5
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
        await this.updateCard(
          benchCard,
          cardId,
          benchPositions[i],
          isOwner,
          rotation,
          scene,
          { player: playerType, slot: SlotType.BENCH, index: i },
          1.0
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
        scene,
        (player.deck as any)?.sleeveImagePath
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

    // Stadium is now shared - synced separately in syncState()

    // Prize cards (show in 2x3 grid)
    if (player.prizes) {
      await this.updatePrizeStack(
        playerPrefix,
        player.prizes,
        ZONE_POSITIONS[position].prizes,
        isOwner,
        rotation,
        scene,
        player
      );
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
    }

    // Update overlays for PokemonCardList
    if (cardList instanceof PokemonCardList) {
      await this.updatePokemonOverlays(cardId, cardList, cardMesh, breakCard, isFaceDown, scene);
    } else {
      // Clear any existing overlays for non-Pokemon cards
      this.clearOverlays(cardId, scene);
    }
  }

  /**
   * Update overlays for a PokemonCardList (energies, damage, conditions, BREAK, tools)
   */
  private async updatePokemonOverlays(
    cardId: string,
    cardList: PokemonCardList,
    cardMesh: Board3dCard,
    breakCard: Card | undefined,
    isFaceDown: boolean,
    scene: Scene
  ): Promise<void> {
    // Get or create overlay objects
    let overlays = this.cardOverlays.get(cardId);
    if (!overlays) {
      overlays = {
        energySprite: new Board3dEnergySprite(),
        damageCounter: new Board3dDamageCounter(),
        marker: new Board3dMarker(this.assetLoader),
        toolCards: []
      };
      this.cardOverlays.set(cardId, overlays);

      // Add overlay groups to card group
      cardMesh.getGroup().add(overlays.energySprite.getGroup());
      cardMesh.getGroup().add(overlays.damageCounter.getGroup());
      cardMesh.getGroup().add(overlays.marker.getGroup());
    }

    // Update energies
    if (cardList.energies && cardList.energies.cards.length > 0) {
      await this.updateEnergyOverlay(overlays, cardList.energies.cards);
    } else {
      overlays.energySprite.clear();
    }

    // Update damage counter
    overlays.damageCounter.updateDamage(cardList.damage);

    // Update special condition markers
    await overlays.marker.updateConditions(cardList.specialConditions);

    // Update BREAK card overlay
    await this.updateBreakOverlay(cardId, overlays, cardMesh, breakCard, isFaceDown, scene);

    // Update tool cards
    await this.updateToolOverlay(cardId, overlays, cardList.tools, cardMesh, scene);
  }

  /**
   * Update energy overlay sprites
   */
  private async updateEnergyOverlay(
    overlays: CardOverlays,
    energyCards: Card[]
  ): Promise<void> {
    // Load energy textures
    const cardBackTexture = await this.assetLoader.loadCardBack();

    for (const card of energyCards) {
      const iconPath = Board3dEnergySprite.getEnergyIconPath(card);
      if (iconPath && !this.energyTextureCache.has(iconPath)) {
        try {
          const texture = await this.assetLoader.loadCardTexture(iconPath);
          this.energyTextureCache.set(iconPath, texture);
        } catch {
          // Use card back as fallback
        }
      }
    }

    overlays.energySprite.updateEnergies(energyCards, this.energyTextureCache, cardBackTexture);
  }

  /**
   * Update BREAK card overlay
   */
  private async updateBreakOverlay(
    cardId: string,
    overlays: CardOverlays,
    mainCardMesh: Board3dCard,
    breakCard: Card | undefined,
    isFaceDown: boolean,
    scene: Scene
  ): Promise<void> {
    if (breakCard && !isFaceDown) {
      const breakScanUrl = this.cardsBaseService.getScanUrl(breakCard);
      const [breakFrontTexture, breakBackTexture] = await Promise.all([
        this.assetLoader.loadCardTexture(breakScanUrl),
        this.assetLoader.loadCardBack()
      ]);

      if (!overlays.breakCard) {
        // Create BREAK card overlay
        overlays.breakCard = new Board3dCard(
          breakFrontTexture,
          breakBackTexture,
          new Vector3(0, 0.05, 0), // Slightly above main card
          0,
          1.0
        );
        mainCardMesh.getGroup().add(overlays.breakCard.getGroup());
      } else {
        overlays.breakCard.updateTexture(breakFrontTexture, breakBackTexture);
      }
    } else if (overlays.breakCard) {
      // Remove BREAK card overlay
      mainCardMesh.getGroup().remove(overlays.breakCard.getGroup());
      overlays.breakCard.dispose();
      overlays.breakCard = undefined;
    }
  }

  /**
   * Update tool card overlays
   */
  private async updateToolOverlay(
    cardId: string,
    overlays: CardOverlays,
    tools: Card[],
    mainCardMesh: Board3dCard,
    scene: Scene
  ): Promise<void> {
    // Clear existing tool cards
    for (const toolCard of overlays.toolCards) {
      mainCardMesh.getGroup().remove(toolCard.getGroup());
      toolCard.dispose();
    }
    overlays.toolCards = [];

    if (tools.length === 0) {
      return;
    }

    // Create new tool card overlays
    const backTexture = await this.assetLoader.loadCardBack();

    // Custom tool icon mapping (matching 2D board logic)
    const customToolIcons: { [key: string]: string } = {
      'Vitality Band': 'assets/tools/vitality-band.png',
      'Bravery Charm': 'assets/tools/bravery-charm.png',
    };

    // Base position: left: -5px ≈ -0.2 units, top: 20% ≈ 0.7 units from top
    const baseX = -0.2; // Left side of card
    const baseZ = -0.7; // 20% from top (card top is at ~-1.75, so 20% down = -0.7)
    const verticalSpacing = 0.3; // 15px offset ≈ 0.3 units in 3D space

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      // Check for custom tool icon first
      let toolTexture: Texture;
      const customIconPath = customToolIcons[tool.name];
      if (customIconPath) {
        // Load custom tool icon
        try {
          toolTexture = await this.assetLoader.loadToolIconTexture(customIconPath);
        } catch (error) {
          // Fall back to card texture if custom icon fails
          const toolScanUrl = this.cardsBaseService.getScanUrl(tool);
          toolTexture = await this.assetLoader.loadCardTexture(toolScanUrl);
        }
      } else {
        // Use regular card texture
        const toolScanUrl = this.cardsBaseService.getScanUrl(tool);
        toolTexture = await this.assetLoader.loadCardTexture(toolScanUrl);
      }

      const toolCardMesh = new Board3dCard(
        toolTexture,
        backTexture,
        new Vector3(baseX, 0.02 + (i * 0.01), baseZ + (i * verticalSpacing)), // Left side, stacked vertically
        0,
        0.33 // Scale to match 33px width (card is ~2.5 units wide, so 33px ≈ 0.33 units)
      );

      mainCardMesh.getGroup().add(toolCardMesh.getGroup());
      overlays.toolCards.push(toolCardMesh);
    }
  }

  /**
   * Clear overlays for a card
   */
  private clearOverlays(cardId: string, scene: Scene): void {
    const overlays = this.cardOverlays.get(cardId);
    if (overlays) {
      overlays.energySprite.dispose();
      overlays.damageCounter.dispose();
      overlays.marker.dispose();
      if (overlays.breakCard) {
        overlays.breakCard.dispose();
      }
      for (const toolCard of overlays.toolCards) {
        toolCard.dispose();
      }
      this.cardOverlays.delete(cardId);
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
    scene: Scene,
    sleeveImagePath?: string
  ): Promise<void> {
    // Remove old stack if it exists
    const oldStack = this.deckStacks.get(stackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
    }

    // Load sleeve texture if available, otherwise use cardback
    let cardBackTexture: Texture;
    if (sleeveImagePath) {
      const sleeveUrl = this.cardsBaseService.getSleeveUrl(sleeveImagePath);
      if (sleeveUrl) {
        cardBackTexture = await this.assetLoader.loadSleeveTexture(sleeveUrl);
      } else {
        cardBackTexture = await this.assetLoader.loadCardBack();
      }
    } else {
      cardBackTexture = await this.assetLoader.loadCardBack();
    }
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
    const quaternion = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, rotationRad, 0));

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
   * Update or create prize cards in a 2x3 grid layout
   */
  private async updatePrizeStack(
    playerPrefix: string,
    prizes: CardList[],
    basePosition: Vector3,
    isOwner: boolean,
    rotation: number,
    scene: Scene,
    player: Player
  ): Promise<void> {
    // Clean up old prize stack if it exists (from previous stack-based rendering)
    const oldStackId = `${playerPrefix}_prizes`;
    const oldStack = this.deckStacks.get(oldStackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
      this.deckStacks.delete(oldStackId);
    }

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
        await this.updateCard(
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
      } else {
        // Remove empty prize slot
        this.removeCard(prizeId, scene);
      }
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
    this.clearOverlays(cardId, scene);
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
    // Clean up all card overlays
    this.cardOverlays.forEach((overlays, cardId) => {
      this.clearOverlays(cardId, scene);
    });
    this.cardOverlays.clear();

    // Clean up cards
    this.cardsMap.forEach(card => {
      scene.remove(card.getGroup());
      card.dispose();
    });
    this.cardsMap.clear();

    // Clean up deck stacks
    this.deckStacks.forEach(stack => {
      scene.remove(stack);
      stack.geometry.dispose();
      (stack.material as MeshStandardMaterial).dispose();
    });
    this.deckStacks.clear();

    // Clean up energy texture cache
    this.energyTextureCache.forEach(texture => {
      texture.dispose();
    });
    this.energyTextureCache.clear();
  }
}
