import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Shelder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Shell Grab',
    cost: [F],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Shelder';
  public fullName: string = 'Shelder DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}