import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Gather Strength',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    }
  ];

  public set: string = 'SV11B';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Axew';
  public fullName: string = 'Axew SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          // Move to hand
          state = MOVE_CARDS(store, state, player.deck, player.hand, { cards });
          // Reveal to opponent
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_EFFECT,
            cards
          ), () => { });
        }
        // Shuffle deck
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
        return state;
      });
      return state;
    }
    return state;
  }
}
