import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Thundershock',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
  ];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Body Slam
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      }));
    }
    return state;
  }
}