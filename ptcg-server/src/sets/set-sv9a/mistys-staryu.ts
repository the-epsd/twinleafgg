import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MistysStaryu extends PokemonCard {
  public tags = [ CardTag.MISTYS ];
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Bubble Beam',
    cost: [ W ],
    damage: 20,
    text: 'If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Misty\'s Staryu';
  public fullName: string = 'Misty\'s Staryu SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble Beam
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); }
      });
    }

    return state;
  }
}