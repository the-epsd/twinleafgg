import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GameMessage, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, CONFIRMATION_PROMPT } from '../../../game/store/prefabs/prefabs';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../../game/store/prefabs/attack-effects';

export class Drifloon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Float Up',
    cost: [P],
    damage: 20,
    text: 'You may shuffle this Pokémon and all attached cards into your deck.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Drifloon';
  public fullName: string = 'Drifloon 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Float Up
    if (AFTER_ATTACK(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
        }
      }, GameMessage.WANT_TO_SHUFFLE_POKEMON_INTO_DECK);
    }

    return state;
  }
}
