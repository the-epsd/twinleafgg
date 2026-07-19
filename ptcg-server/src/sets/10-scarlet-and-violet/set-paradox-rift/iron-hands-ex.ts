
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES } from '../../../game/store/prefabs/prefabs';

export class IronHandsex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];
  public cardType: CardType = L;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Arm Press',
    cost: [L, L, C],
    damage: 160,
    text: ''
  },
  {
    name: 'Amp You Very Much',
    cost: [L, C, C, C],
    damage: 120,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Iron Hands ex';
  public fullName: string = 'Iron Hands ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Amp You Very Much',
    });
  }
}
