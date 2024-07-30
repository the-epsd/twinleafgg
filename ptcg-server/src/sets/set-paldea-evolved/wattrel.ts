import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Wattrel extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peck',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'United Wings',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Pokémon in your ' +
        'in your discard pile that have the United Wings attack.'
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name: string = 'Wattrel';

  public fullName: string = 'Wattrel PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'United Wings')) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}