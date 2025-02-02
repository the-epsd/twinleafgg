import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Zeraora extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 120;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Combat Thunder',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
    }
  ];

  public set: string = 'SCR';
  public name: string = 'Zeraora';
  public fullName: string = 'Zeraora SV7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = opponentBenched;

      effect.damage = 20 + (totalBenched * 20);
    }
    return state;
  }
}