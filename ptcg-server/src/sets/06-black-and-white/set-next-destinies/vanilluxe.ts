import { GameError, GameMessage, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  SWITCH_ACTIVE_WITH_BENCHED,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vanillish';
  public cardType: CardType[] = [W];
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Slippery Soles',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may switch your Active Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Crushing Ice',
    cost: [W, C, C],
    damage: 60,
    text: 'Does 10 more damage for each Colorless in the Defending Pokémon\'s Retreat Cost.'
  }];

  public set: string = 'NXD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe NXD';

  public readonly SLIPPERY_SOLES_MARKER = 'SLIPPERY_SOLES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SLIPPERY_SOLES_MARKER, this);

    // Slippery Soles
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SLIPPERY_SOLES_MARKER, this);

      const playerHasBench = player.bench.some(b => b.cards.length > 0);
      if (!playerHasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!opponentHasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ABILITY_USED(player, this);

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }

    // Crushing Ice
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();

      if (defending) {
        const retreatCost = defending.retreat.length;
        effect.damage += retreatCost * 10;
      }
    }

    return state;
  }
}
