import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Paras';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Allergic Pollen',
    powerType: PowerType.POKEMON_POWER,
    text: 'As long as Parasect is in play, cards in any player\'s discard piles are not affected by attacks or Pokémon Powers.This power stops working if Parasect becomes Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Sleep Pinchers',
    cost: [G, G],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'N3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Parasect';
  public fullName: string = 'Parasect N3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof MoveCardsEffect) {
      let isParasectInPlay = false;
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.ANY, (list, card) => {
          if (card === this) {
            if (IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
              return;
            }
            if (player.active.getPokemonCard() === this &&
              player.active.specialConditions.includes(SpecialCondition.ASLEEP) ||
              player.active.specialConditions.includes(SpecialCondition.CONFUSED) ||
              player.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
              return;
            }
            isParasectInPlay = true;
          }
        });
      });

      if (!isParasectInPlay) {
        return state;
      }

      if (effect.sourceEffect.powerType === PowerType.POKEMON_POWER ||
        effect.sourceEffect.powerType === PowerType.POKEPOWER ||
        effect.sourceEffect.powerType === PowerType.POKEBODY ||
        effect.sourceCard?.attacks.some(attack => attack.name === effect.sourceEffect.name)) {
        // Check if the source is in the discard pile of any player
        if (state.players.some(player => effect.source === player.discard)) {
          effect.preventDefault = true;
          return state;
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          addSpecialCondition.target = opponent.active;
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }
}
