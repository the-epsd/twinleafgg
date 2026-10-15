import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tsunami',
    cost: [W, C],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Ram',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tsunami
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.opponent.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const damageEffect = new PutDamageEffect(effect, 10);
              damageEffect.target = bench;
              store.reduceEffect(state, damageEffect);
            }
          });
        }
      });
    }

    return state;
  }
}
