import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Delusion',
    cost: [C],
    damage: 0,
    text: 'If Psyduck is Confused, draw 2 cards.'
  },
  {
    name: 'Migraine',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, Psyduck is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Delusion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.specialConditions.includes(SpecialCondition.CONFUSED)) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    // Migraine
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        } else {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    return state;
  }
}
