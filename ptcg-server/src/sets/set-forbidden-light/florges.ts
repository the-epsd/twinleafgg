import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { Card, CardList, ChooseCardsPrompt, CoinFlipPrompt, GameError, GameMessage, PlayerType, PowerType, ShowCardsPrompt, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerToDeckEffect } from '../../game/store/effects/play-card-effects';

export class Florges extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = Y;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }]
  public retreat = [C, C];
  public evolvesFrom = 'Floette';

  public powers = [{
    name: "Wondrous Gift",
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, put an Item card from your discard pile on top of your deck.'
  }];

  public attacks = [{
    name: 'Mist Guard',
    cost: [Y, Y, C],
    damage: 70,
    text: 'Prevent all damage done to this Pokémon by attacks from [N] Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'FLI';
  public name: string = 'Florges';
  public fullName: string = 'Florges FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public readonly MIST_GUARD_MARKER = 'MIST_GUARD_MARKER';
  public readonly CLEAR_MIST_GUARD_MARKER = 'CLEAR_MIST_GUARD_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {

        if (results === false) {
          return state;
        }

        const deckTop = new CardList();

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          cards = selected || [];

          const itemCards = cards.filter(card => card instanceof TrainerCard && card.trainerType === TrainerType.ITEM);
          const nonTrainerCards = cards.filter(card => !(card instanceof TrainerCard));

          let canMoveTrainerCards = true;
          if (itemCards.length > 0) {
            const discardEffect = new TrainerToDeckEffect(player, itemCards[0] as TrainerCard);
            store.reduceEffect(state, discardEffect);
            canMoveTrainerCards = !discardEffect.preventDefault;
          }

          const cardsToMove = canMoveTrainerCards ? cards : nonTrainerCards;

          if (cardsToMove.length > 0) {
            cardsToMove.forEach(card => {
              player.discard.moveCardTo(card, deckTop);
            });

            deckTop.moveToTopOfDestination(player.deck);

            if (cardsToMove.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cardsToMove
              ), () => state);
            }
          }

          return state;
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.MIST_GUARD_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_MIST_GUARD_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.MIST_GUARD_MARKER)) {
      const card = effect.source.getPokemonCard();
      const dragonPokemon = card && card.cardType == N;

      if (dragonPokemon) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_MIST_GUARD_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_MIST_GUARD_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.MIST_GUARD_MARKER, this);
        });
      }
    }

    return state;
  }
}