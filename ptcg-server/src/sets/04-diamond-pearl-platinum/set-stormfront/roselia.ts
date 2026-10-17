import { PokemonCard, PokemonCardList, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Roselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Petal Spikes',
    cost: [P, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep and Poisoned. If Budew is anywhere under Roselia, the Defending Pokémon is now Asleep and Poisoned.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Roselia';
  public fullName: string = 'Roselia SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Petal Spikes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const cardList = StateUtils.findCardList(state, this);
      const hasBudew = cardList instanceof PokemonCardList
        && cardList.getPokemons().some(p => p.name === 'Budew');
      if (hasBudew) {
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      } else {
        COIN_FLIP_PROMPT(store, state, effect.player, result => {
          if (result) {
            ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
          }
        });
      }
    }

    return state;
  }
}
