import { ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AFTER_ATTACK, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Shiftry extends PokemonCard {
  public regulationMark: string = 'D';
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Nuzleaf';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 150;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Fan Tornado',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 110,
    damageCalculation: 'x',
    text: 'You may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
  }];

  public powers = [{
    name: 'Shiftry Substitution',
    text: 'As long as this Pokémon is in the Active Spot, each Supporter card in your opponent\'s hand has the effect “Draw 3 cards.” (This happens instead of the card\'s usual effect.)',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY
  }];

  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Shiftry';
  public fullName: string = 'Shiftry VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {

      const cardList = StateUtils.findCardList(state, this);

      // owner of shiftry
      const player = StateUtils.findOwner(state, cardList);
      const opponent = StateUtils.getOpponent(state, player);

      // if shiftry's player played card, don't block it
      if (player === effect.player) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (player.active === cardList) {
        effect.preventDefault = true;

        opponent.deck.moveTo(opponent.hand, 3);
      }

      return state;
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {
          return store.prompt(state, new ChoosePokemonPrompt(
            opponent.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              opponent.active.clearEffects();
              opponent.switchPokemon(targets[0]);
              return state;
            }
          });
        }
      });
    }

    return state;
  }
}