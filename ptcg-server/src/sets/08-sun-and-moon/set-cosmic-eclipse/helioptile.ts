import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Helioptile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whip',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }, {
    name: 'Rear Kick',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '179';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Helioptile';
  public fullName: string = 'Helioptile CEC';

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
