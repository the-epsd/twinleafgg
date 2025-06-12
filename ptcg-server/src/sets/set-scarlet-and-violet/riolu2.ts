import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Riolu2 extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Punch',
    cost: [CardType.FIGHTING],
    damage: 10,
    text: ''
  },
  {
    name: 'Reckless Charge',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 50,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu2 SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}