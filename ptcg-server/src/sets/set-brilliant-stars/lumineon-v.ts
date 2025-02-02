import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType, BoardEffect } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import {
  PowerType, StoreLike, State, GameMessage, ChooseCardsPrompt,
  ShuffleDeckPrompt,
  ConfirmPrompt,
  ShowCardsPrompt,
  StateUtils,
  GameLog,
  PlayerType
} from '../../game';

export class LumineonV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Luminous Sign',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your ' +
      'Bench during your turn, you may search your deck for a ' +
      'Supporter card, reveal it, and put it into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Aqua Return',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'Shuffle this Pokémon and all attached cards into your deck.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Lumineon V';

  public fullName: string = 'Lumineon V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Luminous Sign' });
            }
          });

          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              store.prompt(state, [new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              )], () => {

                player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                  if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                  }
                });

                cards.forEach((card, index) => {
                  store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                player.deck.moveCardsTo(cards, player.hand);
              });
            }
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.active.clearEffects();
      player.active.moveTo(player.deck);

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }
    return state;
  }
}