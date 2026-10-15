import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Seviper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tail Blade',
    cost: [P],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent can\'t play any Trainer cards from his or her hand during your opponent\'s next turn.'
  },
  {
    name: 'Poison Tail',
    cost: [P, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage and the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Seviper';
  public fullName: string = 'Seviper GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tail Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, supporter: true, stadium: true, tool: true });
        }
      });
    }

    // Poison Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
      });
    }

    return state;
  }
}
