import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, ADD_CONFUSION_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';

export class Lilligant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Petilil';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Petal Dance',
      cost: [G],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads. This Pokemon is now Confused.'
    },
    {
      name: 'Leaf Storm',
      cost: [G, C],
      damage: 30,
      text: 'Heal 20 damage from each of your Grass Pokemon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Lilligant';
  public fullName: string = 'Lilligant BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 30 * heads;
      });

      // This Pokemon becomes Confused
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Heal 20 from each Grass Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.cardType === CardType.GRASS) {
          const healEffect = new HealEffect(player, cardList, 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
