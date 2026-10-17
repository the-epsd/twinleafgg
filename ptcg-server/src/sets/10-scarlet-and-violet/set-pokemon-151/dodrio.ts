import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import {
  ABILITY_USED,
  DRAW_CARDS,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Dodrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Doduo';
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Zooming Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 1 damage counter on this Pokémon. If you do, draw a card.',
  }];

  public attacks = [{
    name: 'Balliastic Beak',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each damage counter on this Pokémon.',
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Dodrio';
  public fullName: string = 'Dodrio MEW';

  public readonly ZOOMING_DRAW_MARKER = 'ZOOMING_DRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ZOOMING_DRAW_MARKER, this);

    // Zooming Draw
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ZOOMING_DRAW_MARKER, this);
      ABILITY_USED(player, this);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
      );
      DRAW_CARDS(store, state, player, 1);
    }

    // Balliastic Beak
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const dodrioDamage = effect.player.active.damage;
      effect.damage += (dodrioDamage * 30 / 10);
    }

    return state;
  }
}
