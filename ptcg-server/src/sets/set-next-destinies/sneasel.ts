import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Corner',
    cost: [D],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Scratch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NXD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
