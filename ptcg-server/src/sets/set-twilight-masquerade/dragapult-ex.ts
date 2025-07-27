import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { SlotType } from '../../game/store/actions/play-card-action';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Dragapultex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public evolvesFrom = 'Drakloak';

  public regulationMark = 'H';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 320;

  public weakness = [];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Jet Headbutt',
    cost: [CardType.COLORLESS],
    damage: 70,
    text: ''
  }, {
    name: 'Phantom Dive',
    cost: [CardType.FIRE, CardType.PSYCHIC],
    damage: 200,
    text: 'Put 6 damage counters on your opponent\'s Benched Pokemon in any way you like.'
  }];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Dragapult ex';

  public fullName: string = 'Dragapult ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(6, store, state, effect, [SlotType.BENCH]);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}