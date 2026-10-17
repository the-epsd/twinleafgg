import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COIN_FLIPS_FOR_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Meowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pay Day',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, draw a card.'
  },
  {
    name: 'Fury Swipes',
    cost: [C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Meowth';
  public fullName: string = 'Meowth LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pay Day
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, effect.player, (results) => {
      MOVE_CARDS(store, state, player.deck, player.hand, { count: 1, sourceCard: this });
      });
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIPS_FOR_ATTACK(player.active, 'Slam', 2);
    }

    return state;
  }
}
