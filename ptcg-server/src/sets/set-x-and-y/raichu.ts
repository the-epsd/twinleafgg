import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [];

  public attacks = [
    {
      name: 'Circle Circuit',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'This attack does 20 damage times the number of your ' +
        'Benched Pokemon.'
    },
    {
      name: 'Thunderbolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 100,
      text: 'Discard all Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'XY';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu XY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const benched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage = benched * 20;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cards = player.active.cards.filter(c => c.superType === SuperType.ENERGY);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      return store.reduceEffect(state, discardEnergy);
    }

    return state;
  }

}
