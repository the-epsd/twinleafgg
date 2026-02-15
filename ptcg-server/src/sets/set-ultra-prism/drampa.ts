import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';

export class Drampa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Outrage',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Dragon Pulse',
      cost: [C, C, C],
      damage: 100,
      text: 'Discard the top 2 cards of your deck.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '117';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Drampa';
  public fullName: string = 'Drampa UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Outrage
    // Ref: AGENTS-patterns.md (damage for each damage counter)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage += 10 * (player.active.damage / 10);
    }

    // Attack 2: Dragon Pulse
    // Ref: set-breakpoint/durant.ts (Mountain Munch - DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 2, this, effect);
    }

    return state;
  }
}
