import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Oricorio extends PokemonCard {

  public tags = [CardTag.FUSION_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Lesson in Zeal',
    powerType: PowerType.ABILITY,
    text: 'All of your Fusion Strike Pokémon take 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). You can\'t apply more than 1 Lesson in Zeal Ability at a time.'
  }];

  public attacks = [{
    name: 'Glistening Droplets',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 0,
    text: 'Put 5 damage counters on your opponent\'s Pokémon in ' +
      'any way you like.'
  }];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public name: string = 'Oricorio';

  public fullName: string = 'Oricorio FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(5, store, state, effect);
    }

    if (effect instanceof PutDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;

      const target = effect.target.getPokemonCard();
      const isTargetFusionStrike = target && target.tags.includes(CardTag.FUSION_STRIKE);

      if (isTargetFusionStrike) {
        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }
        effect.reduceDamage(20, this.powers[0].name);
      }
      return state;
    }
    return state;
  }
}