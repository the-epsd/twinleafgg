import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  MOVE_CARDS,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Diggersby extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bunnelby';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Dig',
    cost: [C, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Hammer Arm',
    cost: [C, C, C, C],
    damage: 90,
    text: 'Discard the top card of your opponent\'s deck.'
  }];

  public set: string = 'CIN';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Diggersby';
  public fullName: string = 'Diggersby CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dig
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Hammer Arm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MOVE_CARDS(store, state, effect.opponent.deck, effect.opponent.discard, { count: 1 });
    }

    return state;
  }
}
