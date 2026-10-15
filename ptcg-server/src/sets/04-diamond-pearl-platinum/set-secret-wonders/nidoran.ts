import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, DRAW_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Nidoran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Poison Skin',
    cost: [P],
    damage: 0,
    text: 'Flip 2 coins. If either of them is heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Nidoran ♂';
  public fullName: string = 'Nidoran ♂ SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    // Poison Skin
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.some(r => r)) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
