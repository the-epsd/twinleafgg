import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class PhanpyVIV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stampede',
      cost: [CardType.FIGHTING],
      damage: 10,
      text: ''
    },
    {
      name: 'Strike Back',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage for each damage counter on this Pokémon.'
    },

  ];

  public set: string = 'VIV';

  public name: string = 'Phanpy';

  public fullName: string = 'Phanpy VIV';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strike Back
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      effect.damage += player.active.damage * 3;
    }

    return state;
  }

}