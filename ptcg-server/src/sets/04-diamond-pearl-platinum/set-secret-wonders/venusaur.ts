import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CHOOSE_SPECIAL_CONDITION_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Ivysaur';
  public hp: number = 130;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Miracle Aroma',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, choose either Asleep, Burned, or Poisoned. The Defending Pokémon is now affected by that Special Condition. This power can\'t be used if Venusaur is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Giant Bloom',
    cost: [G, G, C],
    damage: 60,
    text: 'Flip a coin. If heads, remove 4 damage counters from Venusaur.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Venusaur';
  public fullName: string = 'Venusaur SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Miracle Aroma
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          CHOOSE_SPECIAL_CONDITION_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.ASLEEP, SpecialCondition.BURNED, SpecialCondition.POISONED],
          );
        }
      });
      return state;
    }

    // Giant Bloom
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
