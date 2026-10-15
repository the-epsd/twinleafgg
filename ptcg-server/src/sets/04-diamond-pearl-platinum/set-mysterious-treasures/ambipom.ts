import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, ConfirmPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ambipom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Aipom';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Influence',
    cost: [C, C],
    damage: 30,
    text: 'Your opponent flips a coin until he or she gets heads. For each tails, remove an Energy card attached to the Defending Pokémon and put it on the bottom of your opponent\'s deck.'
  }, {
    name: 'Charity Tail',
    cost: [C, C],
    damage: 80,
    text: 'Before Ambipom does damage, your opponent may discard 2 cards from his or her hand. If he or she does, this attack\'s base damage is 10 instead of 80.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Ambipom';
  public fullName: string = 'Ambipom MT';

  private flipUntilHeadsAndMoveEnergy(
    store: StoreLike,
    state: State,
    effect: any,
  ): void {
    const opponent = effect.opponent;
    COIN_FLIP_PROMPT(store, state, opponent, result => {
      if (result) {
        return;
      }
      const energy = opponent.active.cards.filter((c: Card) => c instanceof EnergyCard);
      if (energy.length === 0) {
        return;
      }
      store.prompt(state, new ChooseCardsPrompt(
        effect.player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, opponent.active, opponent.deck, {
            cards,
            toBottom: true,
            sourceCard: this,
          });
        }
        this.flipUntilHeadsAndMoveEnergy(store, state, effect);
      });
    });
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.flipUntilHeadsAndMoveEnergy(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.hand.cards.length < 2) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        opponent.id,
        GameMessage.WANT_TO_DISCARD_CARDS,
      ), wantToDiscard => {
        if (!wantToDiscard) {
          return;
        }
        store.prompt(state, new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.hand,
          {},
          { min: 2, max: 2, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 2) {
            MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceCard: this });
            effect.damage = 10;
          }
        });
      });
    }

    return state;
  }
}
