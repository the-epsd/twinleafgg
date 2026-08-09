import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Bide',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, if this Pokémon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out, and its remaining HP becomes 10.'
  }, {
    name: 'Kick',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'CES';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, {});
        }
      });
    }

    return state;
  }
}
