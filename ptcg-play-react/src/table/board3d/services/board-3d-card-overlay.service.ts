import { Scene, Vector3, Texture, PerspectiveCamera, Group } from 'three';
import {
  PokemonCardList,
  Card,
  CardList,
  BoardEffect,
  SuperType,
} from 'ptcg-server';
import { Board3dCard } from '../board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { Board3dEnergySprite } from '../board-3d-energy-sprite';
import { Board3dDamageCounter } from '../board-3d-damage-counter';
import { Board3dMarker } from '../board-3d-marker';
import { Board3dAbilityUsedBadge } from '../board-3d-ability-used-badge';
import type { Board3dCardsAdapter } from '../board3dCardsAdapter';
import { apply3dCardHolo } from '../board-3d-holo-apply';

function overlayAttachRoot(host: Board3dCard | Group): Group {
  return host instanceof Board3dCard ? host.getGroup() : host;
}

export interface CardOverlays {
  energySprite: Board3dEnergySprite;
  damageCounter: Board3dDamageCounter;
  marker: Board3dMarker;
  abilityUsedBadge: Board3dAbilityUsedBadge;
  breakCard?: Board3dCard;
  toolCards: Board3dCard[];
}

export class Board3dCardOverlayService {
  private cardOverlays: Map<string, CardOverlays> = new Map();
  private energyTextureCache: Map<string, Texture> = new Map();

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsAdapter: Board3dCardsAdapter
  ) { }

  async updateOverlays(
    cardId: string,
    cardList: PokemonCardList,
    cardHost: Board3dCard | Group,
    breakCard: Card | undefined,
    isFaceDown: boolean,
    scene: Scene
  ): Promise<void> {
    const root = overlayAttachRoot(cardHost);
    let overlays = this.cardOverlays.get(cardId);
    if (!overlays) {
      overlays = {
        energySprite: new Board3dEnergySprite(),
        damageCounter: new Board3dDamageCounter(),
        marker: new Board3dMarker(this.assetLoader),
        abilityUsedBadge: new Board3dAbilityUsedBadge(),
        toolCards: [],
      };
      this.cardOverlays.set(cardId, overlays);
      root.add(overlays.energySprite.getGroup());
      root.add(overlays.damageCounter.getGroup());
      root.add(overlays.marker.getGroup());
      root.add(overlays.abilityUsedBadge.getGroup());
    }

    if (cardList.energies && cardList.energies.cards.length > 0) {
      await this.updateEnergyOverlay(overlays, cardList.energies);
    } else {
      overlays.energySprite.clear();
    }

    overlays.damageCounter.updateDamage(cardList.damage, {
      deferAppearAnimation: !root.visible,
    });

    await overlays.marker.updateConditions(cardList.specialConditions);

    const hasAbilityUsed = cardList.boardEffect.includes(BoardEffect.ABILITY_USED);
    overlays.abilityUsedBadge.updateAbilityUsed(hasAbilityUsed);

    await this.updateBreakOverlay(cardId, overlays, root, breakCard, isFaceDown, scene, cardList);
    await this.updateToolOverlay(cardId, overlays, cardList.tools, root, scene, cardList);
  }

  private energyTextureKey(card: Card, energyCardList: CardList): string | null {
    const custom = Board3dEnergySprite.getEnergyIconPath(card);
    if (custom) {
      return custom;
    }
    if (card.superType === SuperType.ENERGY) {
      const scan = this.cardsAdapter.getScanUrlFor3D(card, energyCardList);
      return scan?.trim() || null;
    }
    return null;
  }

  private async updateEnergyOverlay(overlays: CardOverlays, energyCardList: CardList): Promise<void> {
    if (!energyCardList || energyCardList.cards.length === 0) {
      return;
    }

    const cardBackTexture = await this.assetLoader.loadCardBack();

    for (const card of energyCardList.cards) {
      const key = this.energyTextureKey(card, energyCardList);
      if (key && !this.energyTextureCache.has(key)) {
        try {
          const texture = await this.assetLoader.loadCardTexture(key);
          this.energyTextureCache.set(key, texture);
        } catch {
          // Use card back as fallback in updateEnergies
        }
      }
    }

    overlays.energySprite.updateEnergies(
      energyCardList.cards,
      energyCardList,
      this.energyTextureCache,
      cardBackTexture,
      (c) => this.energyTextureKey(c, energyCardList),
    );
  }

  updateBillboards(camera: PerspectiveCamera): void {
    this.cardOverlays.forEach((overlays) => {
      overlays.energySprite.updateBillboards(camera);
    });
  }

  private async updateBreakOverlay(
    cardId: string,
    overlays: CardOverlays,
    attachRoot: Group,
    breakCard: Card | undefined,
    isFaceDown: boolean,
    scene: Scene,
    cardList?: PokemonCardList
  ): Promise<void> {
    if (breakCard && !isFaceDown) {
      const breakScanUrl = this.cardsAdapter.getScanUrlFor3D(breakCard, cardList);

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
        overlays.breakCard = new Board3dCard(
          breakFrontTexture,
          breakBackTexture,
          new Vector3(0, 0.05, 0),
          0,
          1.0,
          maskTexture
        );
        attachRoot.add(overlays.breakCard.getGroup());
      } else {
        overlays.breakCard.updateTexture(breakFrontTexture, breakBackTexture, maskTexture);
      }
      void apply3dCardHolo(this.assetLoader, overlays.breakCard, breakCard, false);
    } else if (overlays.breakCard) {
      attachRoot.remove(overlays.breakCard.getGroup());
      overlays.breakCard.dispose();
      overlays.breakCard = undefined;
    }
  }

  private async updateToolOverlay(
    cardId: string,
    overlays: CardOverlays,
    tools: Card[],
    attachRoot: Group,
    scene: Scene,
    cardList?: PokemonCardList
  ): Promise<void> {
    for (const toolCard of overlays.toolCards) {
      attachRoot.remove(toolCard.getGroup());
      toolCard.dispose();
    }
    overlays.toolCards = [];

    if (tools.length === 0) {
      return;
    }

    const [backTexture, maskTexture] = await Promise.all([
      this.assetLoader.loadCardBack(),
      this.assetLoader.loadCardMaskTexture()
    ]);

    const customToolIcons: { [key: string]: string } = {
      'Vitality Band': 'assets/tools/vitality-band.png',
      'Bravery Charm': 'assets/tools/bravery-charm.png',
    };

    const baseX = 0;
    const baseY = -0.02;
    const baseZ = -0.75;
    const verticalSpacing = 0.05;

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];

      let toolTexture: Texture;
      const customIconPath = customToolIcons[tool.name];
      if (customIconPath) {
        try {
          toolTexture = await this.assetLoader.loadToolIconTexture(customIconPath);
        } catch (error) {
          const toolScanUrl = this.cardsAdapter.getScanUrlFor3D(tool, cardList);
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
        const toolScanUrl = this.cardsAdapter.getScanUrlFor3D(tool, cardList);
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
        new Vector3(baseX, baseY + (i * 0.01), baseZ - (i * verticalSpacing)),
        0,
        1.0,
        maskTexture
      );

      const toolCardList = new CardList();
      toolCardList.cards = [tool];
      toolCardList.isPublic = true;
      toolCardMesh.getGroup().userData.isToolCard = true;
      toolCardMesh.getGroup().userData.cardData = tool;
      toolCardMesh.getGroup().userData.cardList = toolCardList;

      toolCardMesh.getGroup().renderOrder = 150;
      toolCardMesh.getMesh().renderOrder = 150;

      attachRoot.add(toolCardMesh.getGroup());
      overlays.toolCards.push(toolCardMesh);
      void apply3dCardHolo(this.assetLoader, toolCardMesh, tool, false);
    }
  }

  rekeyOverlays(oldId: string, newId: string): void {
    const overlays = this.cardOverlays.get(oldId);
    if (!overlays) {
      return;
    }
    this.cardOverlays.delete(oldId);
    this.cardOverlays.set(newId, overlays);
  }

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

  dispose(scene: Scene): void {
    this.cardOverlays.forEach((_, cardId) => {
      this.clearOverlays(cardId, scene);
    });
    this.cardOverlays.clear();
    this.energyTextureCache.forEach((texture) => {
      texture.dispose();
    });
    this.energyTextureCache.clear();
  }
}
