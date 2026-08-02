import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, DRAW_CARDS, PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Double Draw',
    cost: [C],
    damage: 0,
    text: 'Draw 2 cards.'
  },
  {
    name: 'Dig',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'BCR';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dunsparce';
  public fullName: string = 'Dunsparce BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 2);
    }

    // Dig
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
