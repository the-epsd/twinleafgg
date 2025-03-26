import { ChooseCardsPrompt, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.deck.moveTo(opponent.discard, 1);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.discard.cards.length > 0) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          )], () => {
            player.discard.moveCardsTo(cards, player.deck);
          });

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });

        });
      }
    }
    return state;
  }
}