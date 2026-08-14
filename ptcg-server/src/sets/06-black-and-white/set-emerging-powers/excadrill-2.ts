import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Excadrill2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drilbur';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dig',
    cost: [F, C],
    damage: 30,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Earthquake',
    cost: [F, C, C],
    damage: 70,
    text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'EPO';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Excadrill';
  public fullName: string = 'Excadrill EPO 57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dig
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Earthquake
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.bench.forEach(bench => {
        if (bench.cards.length > 0) {
          const putDamage = new PutDamageEffect(effect, 10);
          putDamage.target = bench;
          store.reduceEffect(state, putDamage);
        }
      });
    }

    return state;
  }
}
