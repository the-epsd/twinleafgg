import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Controlled Burn',
      cost: [R],
      damage: 0,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Flamethrower',
      cost: [R, R, C],
      damage: 80,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Controlled Burn
    // Ref: set-breakpoint/durant.ts (Mountain Munch - DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.deck.cards.length > 0) {
        DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, opponent, 1, this, effect);
      }
    }

    // Attack 2: Flamethrower
    // Ref: AGENTS-patterns.md (Discard an Energy from this Pokemon)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
