import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: 10 }];
  public retreat = [];

  public attacks = [{
    name: 'Tail Whip',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
  },
{
    name: 'Bite',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Rattata';
  public fullName: string = 'Rattata SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tail Whip
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
