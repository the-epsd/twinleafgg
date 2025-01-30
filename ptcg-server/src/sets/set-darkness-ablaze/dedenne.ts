import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Dedenne extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 70;

  public weakness = [{ type: M }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Mad Party',
      cost: [P, C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Pokémon in your discard pile that has the Mad Party attack.'
    }
  ];

  public set: string = 'DAA';

  public name: string = 'Dedenne';

  public fullName: string = 'Dedenne DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public regulationMark = 'D';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Mad Party'))
          pokemonCount += 1;
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}
