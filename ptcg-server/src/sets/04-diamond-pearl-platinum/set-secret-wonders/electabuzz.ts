import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Thundershock',
    cost: [L],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Thunder',
    cost: [L, L, C],
    damage: 60,
    text: 'Flip a coin. If tails, Electabuzz does 30 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thundershock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, flipResult => {
        if (!flipResult) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
