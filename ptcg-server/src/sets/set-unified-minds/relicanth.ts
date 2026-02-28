import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Relicanth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Deep Sea Boring',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Water Pulse',
      cost: [C, C],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Relicanth';
  public fullName: string = 'Relicanth UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Deep Sea Boring
    // Ref: set-unbroken-bonds/darmanitan.ts (Find Wildfire - search deck for cards)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: true }
      );
    }

    // Attack 2: Water Pulse
    // Ref: AGENTS-patterns.md (Asleep status)
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
