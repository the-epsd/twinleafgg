import { Injectable } from '@angular/core';
import { Scene, Vector3, Texture, PerspectiveCamera } from 'three';
import { PokemonCardList, Card, CardList, BoardEffect, SpecialCondition } from 'ptcg-server';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { Board3dEnergySprite } from '../board-3d/board-3d-energy-sprite';
import { Board3dDamageCounter } from '../board-3d/board-3d-damage-counter';
import { Board3dMarker } from '../board-3d/board-3d-marker';
import { Board3dAbilityUsedBadge } from '../board-3d/board-3d-ability-used-badge';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

// Card overlay data for tracking energies, damage, markers per card
export interface CardOverlays {
  energySprite: Board3dEnergySprite;
  damageCounter: Board3dDamageCounter;
  marker: Board3dMarker;
  abilityUsedBadge: Board3dAbilityUsedBadge;
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
        abilityUsedBadge: new Board3dAbilityUsedBadge(),
        toolCards: []
      };
      this.cardOverlays.set(cardId, overlays);

      // Add overlay groups to card group
      cardMesh.getGroup().add(overlays.energySprite.getGroup());
      cardMesh.getGroup().add(overlays.damageCounter.getGroup());
      cardMesh.getGroup().add(overlays.marker.getGroup());
      cardMesh.getGroup().add(overlays.abilityUsedBadge.getGroup());
    }

    // Update energies
    if (cardList.energies && cardList.energies.cards.length > 0) {
      await this.updateEnergyOverlay(overlays, cardList.energies);
    } else {
      overlays.energySprite.clear();
    }

    // Update damage counter
    overlays.damageCounter.updateDamage(cardList.damage);

    // Update special condition markers
    await overlays.marker.updateConditions(cardList.specialConditions);

    // Update ability used badge
    const hasAbilityUsed = cardList.boardEffect.includes(BoardEffect.ABILITY_USED) ||
      cardList.specialConditions.includes(SpecialCondition.ABILITY_USED);
    overlays.abilityUsedBadge.updateAbilityUsed(hasAbilityUsed);

    // Update BREAK card overlay
    await this.updateBreakOverlay(cardId, overlays, cardMesh, breakCard, isFaceDown, scene, cardList);

    // Update tool cards
    await this.updateToolOverlay(cardId, overlays, cardList.tools, cardMesh, scene, cardList);
  }

  /**
   * Update energy overlay sprites
   */
  private async updateEnergyOverlay(
    overlays: CardOverlays,
    energyCardList: CardList
  ): Promise<void> {
    if (!energyCardList || energyCardList.cards.length === 0) return;

    const cardBackTexture = await this.assetLoader.loadCardBack();

    for (const card of energyCardList.cards) {
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

    overlays.energySprite.updateEnergies(energyCardList.cards, energyCardList, this.energyTextureCache, cardBackTexture);
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
    scene: Scene,
    cardList?: PokemonCardList
  ): Promise<void> {
    if (breakCard && !isFaceDown) {
      const breakScanUrl = this.cardsBaseService.getScanUrlFromCardList(breakCard, cardList);

      // Validate URL before loading - if empty or invalid, use cardback
      const loadBreakTexture = async () => {
        if (!breakScanUrl || !breakScanUrl.trim()) {
          console.warn('Empty scanUrl for BREAK card:', breakCard?.fullName, 'set:', breakCard?.set, 'setNumber:', breakCard?.setNumber);
          return this.assetLoader.loadCardBack();
        }
        try {
          return await this.assetLoader.loadCardTexture(breakScanUrl);
        } catch (error) {
          console.error('Failed to load BREAK card texture:', breakScanUrl, error);
          return this.assetLoader.loadCardBack();
        }
      };

      const [breakFrontTexture, breakBackTexture, maskTexture] = await Promise.all([
        loadBreakTexture(),
        this.assetLoader.loadCardBack(),
        this.assetLoader.loadCardMaskTexture()
      ]);

      if (!overlays.breakCard) {
        // Create BREAK card overlay
        overlays.breakCard = new Board3dCard(
          breakFrontTexture,
          breakBackTexture,
          new Vector3(0, 0.05, 0), // Slightly above main card
          0,
          1.0,
          maskTexture
        );
        mainCardMesh.getGroup().add(overlays.breakCard.getGroup());
      } else {
        overlays.breakCard.updateTexture(breakFrontTexture, breakBackTexture, maskTexture);
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
    scene: Scene,
    cardList?: PokemonCardList
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
    const [backTexture, maskTexture] = await Promise.all([
      this.assetLoader.loadCardBack(),
      this.assetLoader.loadCardMaskTexture()
    ]);

    // Custom tool icon mapping (matching 2D board logic)
    const customToolIcons: { [key: string]: string } = {
      'Vitality Band': 'assets/tools/vitality-band.png',
      'Bravery Charm': 'assets/tools/bravery-charm.png',
    };

    // Position tools underneath the main card so top edge sticks out
    // Card geometry is 2.5 x 3.5 x 0.02, rotated -90 degrees on X axis (lying flat)
    // After rotation, card's local +Y axis (height) points in world +Z direction
    // Main card center is at (0, 0, 0), top edge at Z = +1.75, bottom edge at Z = -1.75
    // Position tool card below main card so its top edge (center Z + 1.75) is visible above main card bottom
    // Y axis maps to world Y (height). Board center at Y=0.05; main card at Y=0.1.
    // Tool must be above 0.05 (avoid occlusion) but below 0.1 (appear under main card).
    const baseX = 0; // Center horizontally (full-size cards are wider)
    const baseY = -0.02; // Slightly below main card (world Y≈0.08) - above board center, under card
    const baseZ = -0.75; // Below main card (main card bottom is at Z = -1.75, so -2.0 puts tool card below with top visible)
    const verticalSpacing = 0.05; // Small spacing between stacked tools

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
          // Fall back to card texture if custom icon fails (checks artworksMap for overrides first)
          const toolScanUrl = this.cardsBaseService.getScanUrlFromCardList(tool, cardList);
          if (!toolScanUrl || !toolScanUrl.trim()) {
            console.warn('Empty scanUrl for tool card:', tool?.fullName, 'set:', tool?.set, 'setNumber:', tool?.setNumber);
            toolTexture = await this.assetLoader.loadCardBack();
          } else {
            try {
              toolTexture = await this.assetLoader.loadCardTexture(toolScanUrl);
            } catch (textureError) {
              console.error('Failed to load tool card texture:', toolScanUrl, textureError);
              toolTexture = await this.assetLoader.loadCardBack();
            }
          }
        }
      } else {
        // Use regular card texture (checks artworksMap for overrides first, like 2D components do)
        const toolScanUrl = this.cardsBaseService.getScanUrlFromCardList(tool, cardList);
        if (!toolScanUrl || !toolScanUrl.trim()) {
          console.warn('Empty scanUrl for tool card:', tool?.fullName, 'set:', tool?.set, 'setNumber:', tool?.setNumber);
          toolTexture = await this.assetLoader.loadCardBack();
        } else {
          try {
            toolTexture = await this.assetLoader.loadCardTexture(toolScanUrl);
          } catch (error) {
            console.error('Failed to load tool card texture:', toolScanUrl, error);
            toolTexture = await this.assetLoader.loadCardBack();
          }
        }
      }

      const toolCardMesh = new Board3dCard(
        toolTexture,
        backTexture,
        new Vector3(baseX, baseY + (i * 0.01), baseZ - (i * verticalSpacing)), // Below main card, stacked downward, slightly behind
        0,
        1.0, // Same size as main card
        maskTexture
      );

      // userData for click-to-show-tool-card-info
      const toolCardList = new CardList();
      toolCardList.cards = [tool];
      toolCardList.isPublic = true;
      toolCardMesh.getGroup().userData.isToolCard = true;
      toolCardMesh.getGroup().userData.cardData = tool;
      toolCardMesh.getGroup().userData.cardList = toolCardList;

      // Render above board center overlay (renderOrder 100) so tools are visible on active Pokemon
      toolCardMesh.getGroup().renderOrder = 150;
      toolCardMesh.getMesh().renderOrder = 150;

      mainCardMesh.getGroup().add(toolCardMesh.getGroup());
      overlays.toolCards.push(toolCardMesh);
    }
  }

  /**
   * Update all energy sprites to face the camera (billboard behavior).
   * Call each frame before rendering.
   */
  updateBillboards(camera: PerspectiveCamera): void {
    this.cardOverlays.forEach(overlays => {
      overlays.energySprite.updateBillboards(camera);
    });
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
      overlays.abilityUsedBadge.dispose();
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
