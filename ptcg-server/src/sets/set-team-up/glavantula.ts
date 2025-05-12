import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, StateUtils, PlayerType, GameError, GameMessage, ChooseCardsPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Unnerve',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
  }];

  public attacks = [{
    name: 'Spider Thread',
    cost: [L],
    damage: 40,
    text: 'Put a card from your discard pile into your hand.'
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Unnerve
    if (effect instanceof TrainerTargetEffect && effect.target?.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) { return state; }

      // finding if the owner of the card is playing the trainer or if the opponent is
      let isGalvantulaOnOpponentsSide = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) { isGalvantulaOnOpponentsSide = true; }
      });
      if (!isGalvantulaOnOpponentsSide) { return state; }

      effect.target = undefined;
    }

    // Spider Thread
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasCardInDiscard = player.discard.cards.some(c => {
        return c instanceof Card;
      });
      if (!hasCardInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false }
        )], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  }
}
