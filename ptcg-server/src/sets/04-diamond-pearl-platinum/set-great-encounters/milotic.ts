import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../../game/store/effects/attack-effects';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Milotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Feebas';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Marvel Scale',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Milotic by your opponent\'s Pokémon LV.X.'
  }];

  public attacks = [{
    name: 'Twister',
    cost: [W, C, C],
    damage: 50,
    text: 'Flip 2 coins. If both are tails, this attack does nothing. For each heads, discard an Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Milotic';
  public fullName: string = 'Milotic GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Marvel Scale
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      const attacker = effect.source.getPokemonCard();
      if (!attacker || !attacker.hasTag(CardTag.POKEMON_LV_X)) {
        return state;
      }
      if (StateUtils.findOwner(state, effect.source) === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      effect.preventDefault = true;
    }

    // Twister
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.every(result => !result)) {
          effect.damage = 0;
          return;
        }
        const headsCount = results.filter(result => result).length;
        if (headsCount > 0) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, undefined, headsCount);
        }
      });
    }

    return state;
  }
}
