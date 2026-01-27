import { Injectable } from '@angular/core';
import { Scene, Vector3, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Euler, Texture } from 'three';
import { CardList } from 'ptcg-server';
import { Board3dCard } from '../board-3d/board-3d-card';
import { Board3dAssetLoaderService } from './board-3d-asset-loader.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

// Callback type for updating cards (to avoid circular dependency)
export type UpdateCardCallback = (
  cardList: CardList,
  cardId: string,
  position: Vector3,
  isOwner: boolean,
  rotation: number,
  scene: Scene,
  cardTarget?: any,
  scale?: number,
  sleeveImagePath?: string
) => Promise<void>;

// Callback type for getting cards by ID
export type GetCardByIdCallback = (cardId: string) => any;

@Injectable()
export class Board3dStackService {
  private deckStacks: Map<string, InstancedMesh> = new Map();
  private discardStacks: Map<string, InstancedMesh> = new Map();

  constructor(
    private assetLoader: Board3dAssetLoaderService,
    private cardsBaseService: CardsBaseService
  ) { }

  /**
   * Update or create a deck stack using instanced rendering
   */
  async updateDeckStack(
    stackId: string,
    cardCount: number,
    position: Vector3,
    rotation: number,
    scene: Scene,
    sleeveImagePath: string | undefined,
    deckCardList: CardList,
    updateCardCallback: UpdateCardCallback,
    getCardByIdCallback: GetCardByIdCallback
  ): Promise<void> {
    // Remove old stack if it exists
    const oldStack = this.deckStacks.get(stackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
      this.deckStacks.delete(stackId);
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

    // Create clickable top card overlay (face-down)
    if (cardCount > 0 && deckCardList) {
      const topCardId = `${stackId}_top`;
      const topCard = deckCardList.cards[deckCardList.cards.length - 1]; // Latest card
      const topCardList = new CardList();
      topCardList.cards = [topCard];
      topCardList.isPublic = deckCardList.isPublic;
      topCardList.isSecret = deckCardList.isSecret;

      await updateCardCallback(
        topCardList,
        topCardId,
        new Vector3(position.x, position.y + ((cardCount - 1) * 0.01), position.z),
        false, // Not owner - ensures face-down
        rotation,
        scene,
        undefined, // No cardTarget
        1.0,
        sleeveImagePath
      );
    }
  }

  /**
   * Update or create a discard stack using instanced rendering
   * Latest card (last in array) is shown on top as a regular clickable card
   */
  async updateDiscardStack(
    discard: CardList,
    stackId: string,
    position: Vector3,
    rotation: number,
    scene: Scene,
    updateCardCallback: UpdateCardCallback,
    getCardByIdCallback: GetCardByIdCallback
  ): Promise<void> {
    // Remove old stack if it exists
    const oldStack = this.discardStacks.get(stackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
      this.discardStacks.delete(stackId);
    }

    const cardCount = discard.cards.length;
    if (cardCount === 0) {
      return;
    }

    // Latest card (last in array) is the top card - render as regular clickable card
    const topCard = discard.cards[cardCount - 1];
    const topCardId = `${stackId}_top`;

    // Create top card as regular card for clickability
    const topCardList = new CardList();
    topCardList.cards = [topCard];
    topCardList.isPublic = discard.isPublic;
    topCardList.isSecret = discard.isSecret;

    await updateCardCallback(
      topCardList,
      topCardId,
      new Vector3(position.x, position.y + ((cardCount - 1) * 0.01), position.z),
      true, // Always visible
      rotation,
      scene,
      undefined, // No cardTarget
      1.0,
      undefined // No sleeve for discard
    );

    // Mark top card as discard for click detection
    const topCardMesh = getCardByIdCallback(topCardId);
    if (topCardMesh) {
      topCardMesh.getGroup().userData.isDiscard = true;
      topCardMesh.getGroup().userData.cardList = discard;
    }

    // Remaining cards (if any) as instanced stack underneath
    if (cardCount > 1) {
      const remainingCount = cardCount - 1;
      const cardBackTexture = await this.assetLoader.loadCardBack();
      const geometry = new Board3dCard(
        cardBackTexture,
        cardBackTexture,
        new Vector3(0, 0, 0),
        rotation,
        1.0
      ).getMesh().geometry;

      const instancedMesh = new InstancedMesh(
        geometry,
        new MeshStandardMaterial({ map: cardBackTexture }),
        Math.min(remainingCount, 60) // Max 60 instances
      );

      // Position and rotate each card in the stack
      const rotationRad = (rotation * Math.PI) / 180;
      const quaternion = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, rotationRad, 0));

      for (let i = 0; i < remainingCount && i < 60; i++) {
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
      this.discardStacks.set(stackId, instancedMesh);
    }
  }

  /**
   * Remove a stack by ID
   */
  removeStack(stackId: string, scene: Scene, isDeck: boolean): void {
    const stackMap = isDeck ? this.deckStacks : this.discardStacks;
    const oldStack = stackMap.get(stackId);
    if (oldStack) {
      scene.remove(oldStack);
      oldStack.geometry.dispose();
      (oldStack.material as MeshStandardMaterial).dispose();
      stackMap.delete(stackId);
    }
  }

  /**
   * Dispose all resources
   */
  dispose(scene: Scene): void {
    // Clean up deck stacks
    this.deckStacks.forEach(stack => {
      scene.remove(stack);
      stack.geometry.dispose();
      (stack.material as MeshStandardMaterial).dispose();
    });
    this.deckStacks.clear();

    // Clean up discard stacks
    this.discardStacks.forEach(stack => {
      scene.remove(stack);
      stack.geometry.dispose();
      (stack.material as MeshStandardMaterial).dispose();
    });
    this.discardStacks.clear();
  }
}
