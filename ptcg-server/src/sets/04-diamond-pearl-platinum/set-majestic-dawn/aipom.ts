import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND } from '../../../game/store/prefabs/attack-effects';

export class Aipom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Hand Trick',
    cost: [C, C],
    damage: 20,
    text: 'Return Aipom and all cards attached to it to your hand. (If you don\'t have any Benched Pokémon, this attack does nothing.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Aipom';
  public fullName: string = 'Aipom MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 1);
    }

    // Hand Trick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND(store, state, effect);
      return state;
    }

    return state;
  }
}
