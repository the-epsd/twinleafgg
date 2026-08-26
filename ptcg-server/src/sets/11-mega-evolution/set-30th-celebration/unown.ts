import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES } from '../../../game/store/prefabs/prefabs';

export class Unown extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mysterious Signal',
    cost: [P, P],
    damage: 40,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Unown';
  public fullName: string = 'Unown 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Mysterious Signal',
    });
  }
}
