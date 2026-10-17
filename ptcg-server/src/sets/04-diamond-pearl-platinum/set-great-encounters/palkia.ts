import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, MOVE_CARDS, MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Palkia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spacial Rend',
    cost: [W],
    damage: 10,
    text: 'Search your deck for a Stadium card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. If there is any Stadium card in play, discard it.'
  },
  {
    name: 'Transback',
    cost: [W, W, C],
    damage: 40,
    text: 'You may flip a coin. If heads, discard all Energy attached to Palkia and put the Defending Pokémon and all cards attached to it on top of your opponent\'s deck. Your opponent shuffles his or her deck afterward.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Palkia';
  public fullName: string = 'Palkia GE';

  public usedTransback = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spacial Rend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length > 0) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.TRAINER, trainerType: TrainerType.STADIUM },
          { min: 0, max: 1, allowCancel: true }
        ), cards => {
          if (!cards || cards.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          SHUFFLE_DECK(store, state, player);
        });
      }
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const stadiumOwner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, stadiumOwner.discard, { sourceCard: this });
      }
    }

    // Transback
    if (WAS_ATTACK_USED(effect, 1, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToFlip => {
        if (!wantToFlip) {
          return;
        }
        COIN_FLIP_PROMPT(store, state, effect.player, result => {
          if (result) {
            this.usedTransback = true;
            const energies = effect.player.active.cards.filter(c => c instanceof EnergyCard);
            if (energies.length > 0) {
              const discardEnergy = new DiscardCardsEffect(effect, energies);
              discardEnergy.target = effect.player.active;
              store.reduceEffect(state, discardEnergy);
            }
          }
        });
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    if (effect instanceof AfterAttackEffect && this.usedTransback) {
      this.usedTransback = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = opponent.active;
      if (target.cards.length === 0) {
        return state;
      }
      const tools = target.tools.slice();
      tools.forEach(t => { target.moveCardTo(t, opponent.deck); });
      const cards = target.cards.slice();
      cards.forEach(c => { target.moveCardTo(c, opponent.deck); });
      target.clearEffects();
      return SHUFFLE_DECK(store, state, opponent);
    }

    if (effect instanceof EndTurnEffect) {
      this.usedTransback = false;
    }

    return state;
  }
}
