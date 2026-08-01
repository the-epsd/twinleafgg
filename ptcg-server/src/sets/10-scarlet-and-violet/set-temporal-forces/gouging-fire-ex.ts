import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';
import { PREVENT_THIS_ATTACK_UNTIL_LEAVES_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GougingFireex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 230;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Heat Blast',
    cost: [R, C],
    damage: 60,
    text: ''
  },
  {
    name: 'Blaze Blitz',
    cost: [R, R, C],
    damage: 260,
    text: 'This Pokémon can\'t use Blaze Blitz again until it leaves the Active Spot.'
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Gouging Fire ex';
  public fullName: string = 'Gouging Fire ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blaze Blitz
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return PREVENT_THIS_ATTACK_UNTIL_LEAVES_ACTIVE(store, state, effect, this.attacks[1].name);
    }

    return state;
  }
}
