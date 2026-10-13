import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shelgon';
  public hp: number = 150;
  public cardType: CardType[] = [N];
  public weakness = [{ type: Y }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dragon Wind',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon, once during your turn (before your attack), you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Dragon Claw',
    cost: [R, W, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence CES';

  public readonly DRAGON_WIND_MARKER = 'SALAMENCE_CES_DRAGON_WIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragon Wind
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

      USE_ABILITY_ONCE_PER_TURN(player, this.DRAGON_WIND_MARKER, this);
      ABILITY_USED(player, this);

      return GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
        store,
        state,
        player,
        this.powers[0],
        this,
        { allowCancel: false },
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DRAGON_WIND_MARKER, this);

    return state;
  }
}
