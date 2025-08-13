import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MistysStaryu extends PokemonCard {
  public tags = [CardTag.MISTYS];
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble Beam',
    cost: [W],
    damage: 20,
    text: 'If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Misty\'s Staryu';
  public fullName: string = 'Misty\'s Staryu DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble Beam
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this); }
      });
    }

    return state;
  }
}