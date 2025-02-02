import { CardType, StoreLike, State, EnergyCard, TrainerCard, TrainerType, GameError, GameMessage, StateUtils, ChooseCardsPrompt, SuperType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
export class MoonlightHill extends TrainerCard {

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '81';
    
  public trainerType = TrainerType.STADIUM;
  
  public set = 'PAF';
  
  public name = 'Moonlit Hill';
  
  public fullName = 'Moonlit Hill PAF';
  
  public text = 'Once during each player’s turn, that play may discard a Basic [P] Energy from their hand. If they do, they may heal 30 damage from each of their Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }
  
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    const hasEnergyInHand = player.hand.cards.some(c => {
      return c instanceof EnergyCard;
    });
    if (!hasEnergyInHand) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }
    state = store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      player.hand,
      { superType: SuperType.ENERGY, cardType: CardType.PSYCHIC },
      { allowCancel: true, min: 1, max: 1 }
    ), cards => {
      cards = cards || [];
      if (cards.length === 0) {
        return;
      }
      // Heal each Pokemon by 10 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        state = store.reduceEffect(state, healEffect); 
      });
      return state;
    });
    return state;
  }
}