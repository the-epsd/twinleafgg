import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class NsKlang extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'N\'s Klink';
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Twirling Gear',
      cost: [C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    { name: 'Confront', cost: [M, C], damage: 40, text: '' },
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';

  public name: string = 'N\'s Klang';
  public fullName: string = 'N\'s Klang SV9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.addSpecialCondition(SpecialCondition.CONFUSED)
    }
    return state;
  }

}