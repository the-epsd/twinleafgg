import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hitmontop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Triple Kick',
    cost: [F, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Gut Spin',
    cost: [F, C, C],
    damage: 50,
    text: 'If Tyrogue is anywhere under Hitmontop, you may switch Hitmontop with 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Hitmontop';
  public fullName: string = 'Hitmontop LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Triple Kick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    // Gut Spin
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasTyrogue = player.active.cards.some(c => c.name === 'Tyrogue');
      if (hasTyrogue && player.bench.some(b => b.cards.length > 0)) {
        CONFIRMATION_PROMPT(store, state, player, result => {
          if (result) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    return state;
  }
}
