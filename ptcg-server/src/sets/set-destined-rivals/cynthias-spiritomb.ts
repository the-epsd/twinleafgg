import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CynthiasSpiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Raging Curse',
      cost: [C],
      damage: 10,
      damageCalculation: 'x',
      text: 'This attack does 10 damage for each damage counter on all your Benched Cynthia\'s Pokemon. Don\'t apply Weakness for this attack\'s damage.',
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '129';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Spiritomb';
  public fullName: string = 'Cynthia\'s Spiritomb DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let totalDamage = 0;

      player.bench.forEach(pokemon => {
        if (pokemon.cards.some(card => card.tags.includes(CardTag.CYNTHIAS))) {
          totalDamage += pokemon.damage;
        }
      });

      effect.damage = totalDamage;
      effect.ignoreWeakness = true;
      return state;
    }
    return state;
  }
}