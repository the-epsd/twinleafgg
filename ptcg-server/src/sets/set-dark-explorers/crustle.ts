import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Crustle extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dwebble';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Cut',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Heavy Bullet',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'Flip a coin. If heads, this attack does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '8';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Crustle';

  public fullName: string = 'Crustle DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heavy Bullet attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent has benched Pokemon
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        return COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
          }
        });
      }
    }

    return state;
  }
}
