import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Exploud extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Loudred';
  public hp: number = 130;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ambient Noise',
    cost: [C, C],
    damage: 0,
    text: 'Flip 2 coins. If the first coin is heads, this attack does 50 damage to the Defending Pokémon. If the first coin is tails, this attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If the second coin is heads, the Defending Pokémon is now Confused. If the second coin is tails, your opponent can\'t play any Trainer, Supporter, or Stadium cards from his or her hand during your opponent\'s next turn.'
  },
  {
    name: 'Hyper Voice',
    cost: [C, C, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Exploud';
  public fullName: string = 'Exploud GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ambient Noise
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const attackEffect = effect;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const first = results[0];
        const second = results[1];

        if (first) {
          attackEffect.damage = 50;
        } else {
          attackEffect.damage = 0;
          opponent.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const putDamage = new PutDamageEffect(attackEffect, 20);
              putDamage.target = bench;
              store.reduceEffect(state, putDamage);
            }
          });
        }

        if (second) {
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
        } else {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, attackEffect, this, {
            item: true,
            supporter: true,
            stadium: true,
          });
        }
      });
    }

    return state;
  }
}
