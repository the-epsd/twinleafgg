import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class MrMimeex2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 80;
  public retreat = [C];

  public powers = [{
    name: 'Magic Odds',
    powerType: PowerType.POKEBODY,
    text: 'If Mr. Mime ex would be damaged by an attack, prevent that attack’s damage done to Mr. Mime ex if that damage is 20, 40, 60, 80, 100, 120, 140, 160, or 180.'
  }];

  public attacks = [{
    name: 'Breakdown',
    cost: [P, C],
    damage: 0,
    text: 'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Mr. Mime ex';
  public fullName: string = 'Mr. Mime ex RG 111';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }
      // Prevent all damage if damage is an odd multiple of 10 between 10 and 250 (inclusive)
      if (
        effect.damage % 20 === 0 &&
        effect.damage >= 20 &&
        effect.damage <= 180
      ) {
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(effect.opponent.hand.cards.length, store, state, effect);
    }

    return state;
  }
}