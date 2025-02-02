import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Snorunt extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Bite',
    cost: [CardType.WATER],
    damage: 10,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a F Pokémon, this attack does 30 more damage.'
  }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '37';

  public name: string = 'Snorunt';

  public fullName: string = 'Snorunt PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const opponentActive = effect.opponent.active;
      const opponentActiveCard = opponentActive.getPokemonCard();

      if (opponentActiveCard?.cardType === CardType.FIGHTING) {
        effect.damage += 30;
      }
      return state;
    }
    return state;
  }
}