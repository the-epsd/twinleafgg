import { Attack, CardTag, CardType, PokemonCard, Resistance, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Absol extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: F }];
  public resistance: Resistance[] = [{ type: P, value: -20 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Mind Jack',
      cost: [D, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 20 more damage for each of your opponent\'s Benched Pokémon.'
    },
    { name: 'Fearsome Shadow', cost: [D, C, C], damage: 60, text: 'Your opponent reveals his or her hand.' },
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Absol';
  public fullName: string = 'Absol PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
    }

    return state;
  }
}