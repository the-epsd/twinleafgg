import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Wooper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Amnesia',
    cost: [C],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Tail Slap',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Wooper';
  public fullName: string = 'Wooper DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
