import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../game/store/prefabs/prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class Volcarona extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Larvesta';
  public hp: number = 120;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Heat Cyclone',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.',
  }];

  public attacks = [{
    name: 'Heat Blast',
    cost: [R, C],
    damage: 60,
    text: '',
  }];

  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Volcarona';
  public fullName: string = 'Volcarona SLG';

  public readonly HEAT_CYCLONE_MARKER = 'VOLCARONA_HEAT_CYCLONE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heat Cyclone
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.HEAT_CYCLONE_MARKER, this);
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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEAT_CYCLONE_MARKER, this);

    return state;
  }
}
