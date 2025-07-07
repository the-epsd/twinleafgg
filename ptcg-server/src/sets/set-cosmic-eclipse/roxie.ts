import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, PokemonCard, StateUtils } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, DRAW_CARDS, IS_ABILITY_BLOCKED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Roxie extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '205';
  public name: string = 'Roxie';
  public fullName: string = 'Roxie CEC';

  public text: string =
    'Discard up to 2 Pokémon that aren\'t Pokémon-GX or Pokémon-EX from your hand. Draw 3 cards for each card you discarded in this way.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !(card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_GX))) {
          return;
        } else {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 0, max: 2, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        const cardsToDraw = 3 * cards.length;
        state = MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        DRAW_CARDS(player, cardsToDraw);

        // Handling Blow-Away Bomb mons (Joe forgive me for this, I'm going rogue and putting the effect in here)
        // I could not for the life of me figure out how to get the effect to be contained in Koffing and Weezing themselves itself
        cards.forEach(card => {
          if (card instanceof PokemonCard && (card.fullName === 'Koffing CEC' || card.fullName === 'Weezing CEC')) {
            const pokemonCard = card as PokemonCard;
            if (IS_ABILITY_BLOCKED(store, state, player, pokemonCard)) {
              return state;
            }

            CONFIRMATION_PROMPT(store, state, effect.player, result => {
              if (result) {
                opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
                  const effectOfAbility = new EffectOfAbilityEffect(effect.player, pokemonCard.powers[0], pokemonCard, cardList);
                  effectOfAbility.target = cardList;
                  store.reduceEffect(state, effectOfAbility);
                  if (effectOfAbility.target) {
                    cardList.damage += 10;
                  }
                });
              }
            });
          }
        });
      });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    return state;
  }
}
