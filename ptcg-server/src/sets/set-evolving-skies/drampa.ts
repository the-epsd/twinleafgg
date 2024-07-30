import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Drampa extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 120;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Corkscrew Punch',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Berserk',
      cost: [CardType.WATER, CardType.FIGHTING],
      damage: 70,
      damageCalculation: '+',
      text: 'If your Benched Pokémon have any damage counters on them, this attack does 90 more damage.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Drampa';

  public fullName: string = 'Drampa EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const hasBenchDamage = player.bench.some(cardList => cardList.damage > 0);

      if (hasBenchDamage) {
        effect.damage += 90;
      }

      return state;
    }

    return state;
  }

}
