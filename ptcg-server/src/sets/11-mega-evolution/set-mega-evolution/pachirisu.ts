import { PokemonCard, State, StoreLike } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Electrified Incisors',
    cost: [L],
    damage: 10,
    text: 'During your opponent\'s next turn, whenever they attach an Energy card from their hand to the Defending Pokémon, place 8 damage counters on that Pokémon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN(store, state, effect, this, 80);
    }
    return state;
  }
}
