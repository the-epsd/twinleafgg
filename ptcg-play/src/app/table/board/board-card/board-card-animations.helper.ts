import { PokemonCardList, SuperType } from 'ptcg-server';

export interface AnimationState {
  hasPlayedEvolutionAnimation: boolean;
  hasPlayedBasicAnimation: boolean;
  showEvolutionAnimation: boolean;
  showBasicAnimation: boolean;
  showAttackAnimation: boolean;
  isInPrompt: boolean;
  currentCardId: number | string;
}

export class BoardCardAnimationHelper {

  /**
   * Check if evolution animation should be triggered
   */
  static shouldTriggerEvolutionAnimation(
    mainCard: any,
    cardList: PokemonCardList,
    animationState: AnimationState
  ): boolean {
    return mainCard &&
      mainCard.superType === SuperType.POKEMON &&
      !animationState.hasPlayedEvolutionAnimation &&
      cardList.triggerEvolutionAnimation &&
      !animationState.showEvolutionAnimation &&
      !animationState.isInPrompt;
  }

  /**
   * Check if basic Pokemon animation should be triggered
   */
  static shouldTriggerBasicPokemonAnimation(
    mainCard: any,
    cardList: PokemonCardList,
    animationState: AnimationState
  ): boolean {
    return mainCard &&
      mainCard.superType === SuperType.POKEMON &&
      !animationState.hasPlayedBasicAnimation &&
      cardList.showBasicAnimation &&
      !animationState.showBasicAnimation &&
      !animationState.isInPrompt;
  }

  /**
   * Check if attack animation should be triggered
   */
  static shouldTriggerAttackAnimation(
    mainCard: any,
    cardList: PokemonCardList,
    animationState: AnimationState
  ): boolean {
    return mainCard &&
      mainCard.superType === SuperType.POKEMON &&
      cardList.triggerAttackAnimation &&
      !animationState.showAttackAnimation &&
      !animationState.isInPrompt;
  }

  /**
   * Check if this is a new card instance that needs animation reset
   */
  static isNewCardInstance(
    mainCard: any,
    animationState: AnimationState
  ): boolean {
    const newCardId = mainCard?.id;
    return newCardId && newCardId !== animationState.currentCardId;
  }

  /**
   * Reset animation state for a new card
   */
  static resetAnimationStateForNewCard(animationState: AnimationState, newCardId: number | string): void {
    animationState.currentCardId = newCardId;
    animationState.hasPlayedEvolutionAnimation = false;
    animationState.showEvolutionAnimation = false;
    animationState.hasPlayedBasicAnimation = false;
    animationState.showBasicAnimation = false;
  }

  /**
   * Get animation element from DOM
   */
  static getAnimationElement(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  }

  /**
   * Add animation end listener to element
   */
  static addAnimationEndListener(
    element: HTMLElement,
    handler: (event: AnimationEvent) => void
  ): void {
    element.addEventListener('animationend', handler);
  }

  /**
   * Remove animation end listener from element
   */
  static removeAnimationEndListener(
    element: HTMLElement,
    handler: (event: AnimationEvent) => void
  ): void {
    element.removeEventListener('animationend', handler);
  }

  /**
   * Clean up animation handlers
   */
  static cleanupAnimationHandlers(
    animationElement: HTMLElement | null,
    evolutionHandler: (event: AnimationEvent) => void,
    basicHandler: (event: AnimationEvent) => void
  ): void {
    if (animationElement) {
      this.removeAnimationEndListener(animationElement, evolutionHandler);
      this.removeAnimationEndListener(animationElement, basicHandler);
    }
  }
} 