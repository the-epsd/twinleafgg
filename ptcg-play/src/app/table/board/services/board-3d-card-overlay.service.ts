import { Injectable } from '@angular/core';
import { Scene, Vector3, Texture } from 'three';
import { PokemonCardList, Card } from 'ptcg-server';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { Board3dEnergySprite } from '../board-3d/board-3d-energy-sprite';
import { Board3dDamageCounter } from '../board-3d/board-3d-damage-counter';
import { Board3dMarker } from '../board-3d/board-3d-marker';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

// Card overlay data for tracking energies, damage, markers per card
export interface CardOverlays {
  energySprite: Board3dEnergySprite;
  damageCounter: Board3dDamageCounter;
  marker: Board3dMarker;
  breakCard?: Board3dCard;
  toolCards: Board3dCard[];
}

@Injectable()
export class Board3dCardOverlayService {
  private cardOverlays: Map<string, CardOverlays> = new Map();
  private energyTextureCache: Map<string, Texture> = new Map();

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) { }

  /**
   * Update overlays for a PokemonCardList (energies, damage, conditions, BREAK, tools)
   */
  async updateOverlays(
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
  clearOverlays(cardId: string, scene: Scene): void {
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
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    // Clean up all card overlays
    this.cardOverlays.forEach((overlays, cardId) => {
      this.clearOverlays(cardId, scene);
    });
    this.cardOverlays.clear();

    // Clean up energy texture cache
    this.energyTextureCache.forEach(texture => {
      texture.dispose();
    });
    this.energyTextureCache.clear();
  }
}
