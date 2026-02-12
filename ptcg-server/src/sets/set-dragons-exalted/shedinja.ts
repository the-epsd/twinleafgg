import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Shedinja extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nincada';
  public cardType: CardType = P;
  public hp: number = 60;
  public retreat = [];

  public powers = [{
    name: 'Empty Shell',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is Knocked Out, your opponent can\'t take any Prize cards for it.'
  }];

  public attacks = [
    {
      name: 'Cursed Drop',
      cost: [P],
      damage: 0,
      text: 'Put 3 damage counters on your opponent\'s Pokemon in any way you like.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shedinja';
  public fullName: string = 'Shedinja DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Empty Shell - No prizes when KO'd
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard === this) {
        const player = StateUtils.findOwner(state, effect.target);
        if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
          effect.prizeCount = 0;
        }
      }
    }

    // Attack: Cursed Drop
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect);
    }

    return state;
  }
}
