import { GameError, GameMessage, PowerType, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  CONFIRMATION_PROMPT,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Braviary extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rufflet';
  public cardType: CardType[] = [C];
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Big Wing',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may have your opponent switch his or her Active Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Wild Edge',
    cost: [C, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
  }];

  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Braviary';
  public fullName: string = 'Braviary PLS';

  public readonly BIG_WING_MARKER = 'BIG_WING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BIG_WING_MARKER, this);

    // Big Wing
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.BIG_WING_MARKER, this);
      ABILITY_USED(player, this);
      return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }

    // Wild Edge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 20;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        }
      });
    }

    return state;
  }
}
