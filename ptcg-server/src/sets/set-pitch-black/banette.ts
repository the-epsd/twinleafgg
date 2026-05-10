import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  AFTER_ATTACK,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
} from '../../game/store/prefabs/prefabs';
import { reduceGhostVeil } from './ghost-veil';

export class Banette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Ghost Veil',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Doll Catch',
    cost: [P],
    damage: 80,
    text: 'You may search your deck for any card and put it into your hand. If you do, shuffle your deck.',
  }];

  public set: string = 'M5';
  public setNumber: string = '32';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Banette';
  public fullName: string = 'Banette M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceGhostVeil(store, state, effect, this);

    // Ref: set-chilling-reign/tapu-fini.ts (optional effect — ConfirmPrompt)
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_DRAW_CARDS,
      ), wantSearch => {
        if (wantSearch && player.deck.cards.length > 0) {
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false }, effect);
        }
      });
    }

    return state;
  }
}
