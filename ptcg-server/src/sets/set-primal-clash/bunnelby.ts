import { ChooseCardsPrompt } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Bunnelby extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Barrage',
    powerType: PowerType.ANCIENT_TRAIT,
    barrage: true,
    text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Burrow',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Discard the top card of your opponent\'s deck.'
  }, {
    name: 'Rototiller',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Shuffle a card from your discard pile into your deck.'
  }];

  public set: string = 'PRC';

  public name: string = 'Bunnelby';

  public fullName: string = 'Bunnelby PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.discard.cards.length > 0) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this, sourceEffect: this.attacks[1] });
          SHUFFLE_DECK(store, state, player);
        });
      }
    }
    return state;
  }
}