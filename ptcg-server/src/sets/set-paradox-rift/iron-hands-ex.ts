
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TAKE_X_MORE_PRIZE_CARDS, WAS_ATTACK_USED, YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK } from '../../game/store/prefabs/prefabs';

export class IronHandsex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Arm Press',
      cost: [CardType.COLORLESS],
      damage: 160,
      text: ''
    },
    {
      name: 'Amp You Very Much',
      cost: [CardType.COLORLESS],
      damage: 220,
      text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take I more Prize card.'
    },
  ];

  public set: string = 'PAR';

  public set2: string = 'futureflash';
  
  public setNumber: string = '27';

  public name: string = 'Iron Hands ex';

  public fullName: string = 'Iron Hands ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if(WAS_ATTACK_USED(effect, 1, this)){
      if(YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state)){
        return TAKE_X_MORE_PRIZE_CARDS(effect, state);
      }
    }
    return state;
  }
}
