import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Shuppet extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Enveloping Shadow',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Enveloping Shadow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
        }
      });
    }
    return state;
  }
}
