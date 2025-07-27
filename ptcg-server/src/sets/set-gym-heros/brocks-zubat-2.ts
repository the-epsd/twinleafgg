import { State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class BrocksZubat2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BROCKS];
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Poison Fang',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Brock\'s Zubat';
  public fullName: string = 'Brock\'s Zubat G1 74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });

    }

    return state;
  }
}