import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class ShayminV extends PokemonCard {

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flap',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    },
    {
      name: 'Revenge Blast',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each Prize card your opponent has taken.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Shaymin V';

  public fullName: string = 'Shaymin V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const damagePerPrize = 40;

      effect.damage = 60 + (prizesTaken * damagePerPrize);
    }
    return state;
  }
}