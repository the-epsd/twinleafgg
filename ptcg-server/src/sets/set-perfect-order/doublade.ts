import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Doublade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Honedge';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sword Stash',
    cost: [C, C],
    damage: 0,
    text: 'You may reveal any number of Honedge, Doublade, and Aegislash from your hand. This attack does 60 damage for each card you revealed.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Doublade';
  public fullName: string = 'Doublade M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Find indices of cards that should be blocked (not Honedge, Doublade, or Aegislash)
      const blockedIndices: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) ||
          (card.name !== 'Honedge' && card.name !== 'Doublade' && card.name !== 'Aegislash')) {
          blockedIndices.push(index);
        }
      });

      // Check if there are any valid cards
      const validCards = player.hand.cards.filter(card =>
        card instanceof PokemonCard &&
        (card.name === 'Honedge' || card.name === 'Doublade' || card.name === 'Aegislash')
      );

      if (validCards.length === 0) {
        effect.damage = 0;
        return state;
      }

      let revealedCards: any[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.hand,
        {},
        { min: 0, max: validCards.length, allowCancel: false, blocked: blockedIndices }
      ), selected => {
        revealedCards = selected || [];

        // Show revealed cards to opponent
        if (revealedCards.length > 0) {
          store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            revealedCards
          ), () => state);
        }

        // Calculate damage
        effect.damage = revealedCards.length * 60;
      });
    }

    return state;
  }
}
