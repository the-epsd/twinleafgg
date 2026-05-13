import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { GameMessage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import {
  GET_PLAYER_BENCH_SLOTS,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Lampent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Litwick';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Returning Lights',
    cost: [P],
    damage: 0,
    text: 'Search your deck for up to 3 Lampent and put them onto your Bench.',
  }];

  public set: string = 'M5';
  public setNumber: string = '35';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lampent';
  public fullName: string = 'Lampent M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-unbroken-bonds/krookodile.ts (deck interaction); prefabs SEARCH bench pattern — manual slots for variable max
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const slots = GET_PLAYER_BENCH_SLOTS(player);
      const maxPut = Math.min(3, slots.length);

      if (player.deck.cards.length === 0 || maxPut === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, name: 'Lampent' },
        { min: 0, max: maxPut, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
          const slot = slots[index];
          if (slot && card instanceof PokemonCard) {
            store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card, slot));
          }
        });
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
