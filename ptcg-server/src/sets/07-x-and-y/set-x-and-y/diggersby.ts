import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND } from '../../../game/store/prefabs/attack-effects';

export class Diggersby extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bunnelby';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pickup',
    cost: [C, C],
    damage: 0,
    text: 'Put 2 Item cards from your discard pile into your hand.'
  }, {
    name: 'Dig',
    cost: [C, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'XY';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Diggersby';
  public fullName: string = 'Diggersby XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pickup
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(
        2,
        c => c instanceof TrainerCard && c.trainerType === TrainerType.ITEM,
        store,
        state,
        effect
      );
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
