import { TrainerCard } from '../../../game/store/card/trainer-card';
import {
  TrainerType,
  CardTag,
  Stage,
  SuperType,
  EnergyType,
} from '../../../game/store/card/card-types';
import {
  CardTarget,
  ChooseCardsPrompt,
  ConfirmPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  SlotType,
  StoreLike,
  State,
  StateUtils,
} from '../../../game';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { SHUFFLE_DECK, SHOW_CARDS_TO_PLAYER, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

// Names of Pokémon-GX in the deck that can evolve from a Pokémon in play (not played this turn)
function getValidGxNames(state: State, player: Player): string[] {
  const gxEvolutions = player.deck.cards.filter(
    (c) => c instanceof PokemonCard && c.hasTag(CardTag.POKEMON_GX) && c.stage !== Stage.BASIC,
  ) as PokemonCard[];

  const evolvableNames: string[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    if (cardList.pokemonPlayedTurn >= state.turn) {
      return;
    }
    evolvableNames.push(card.name);
  });

  const validGxNames: string[] = [];
  gxEvolutions.forEach((gx) => {
    if (evolvableNames.includes(gx.evolvesFrom) && !validGxNames.includes(gx.name)) {
      validGxNames.push(gx.name);
    }
  });
  return validGxNames;
}

export class RedAndBlue extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TAG_TEAM];
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '202';
  public name: string = 'Red & Blue';
  public fullName: string = 'Red & Blue CEC';
  public text: string =
    "Search your deck for a Pokémon-GX that evolves from 1 of your Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck. (You can't use this card during your first turn or on a Pokémon that was put into play this turn.) When you play this card, you may discard 2 other cards from your hand. If you do, search your deck for up to 2 basic Energy cards and attach them to the Pokémon you evolved in this way. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Can't use during first turn
    if (state.turn <= 2) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return getValidGxNames(state, player).length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Can't use during first turn
      if (state.turn <= 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Find valid GX evolutions in deck
      const validGxNames = getValidGxNames(state, player);

      if (validGxNames.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Build blocked indices for deck search
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (
          !(
            card instanceof PokemonCard &&
            card.hasTag(CardTag.POKEMON_GX) &&
            validGxNames.includes(card.name)
          )
        ) {
          blocked.push(index);
        }
      });

      // Step 1: Choose a GX evolution from deck
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_EVOLVE,
          player.deck,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }

          const evolution = cards[0] as PokemonCard;
          const opponent = StateUtils.getOpponent(state, player);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, [evolution]);

          // Step 2: Choose which Pokemon to evolve
          const blocked2: CardTarget[] = [];
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (card.name !== evolution.evolvesFrom || cardList.pokemonPlayedTurn >= state.turn) {
              blocked2.push(target);
            }
          });

          store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { allowCancel: false, blocked: blocked2 },
            ),
            (targets) => {
              if (!targets || targets.length === 0) {
                SHUFFLE_DECK(store, state, player);
                return;
              }

              const targetSlot = targets[0];

              // Evolve
              MOVE_CARDS(store, state, player.deck, targetSlot, {
                cards: [evolution],
                sourceCard: this,
              });
              targetSlot.clearEffects();
              targetSlot.pokemonPlayedTurn = state.turn;

              SHUFFLE_DECK(store, state, player);

              // Step 3: Optional - discard 2 cards to attach up to 2 basic energy
              const handCards = player.hand.cards.filter((c) => c !== this);
              if (handCards.length < 2) {
                return;
              }

              // Check if deck has basic energy
              const hasBasicEnergy = player.deck.cards.some(
                (c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
              );

              if (!hasBasicEnergy) {
                return;
              }

              const handBlocked: number[] = [];
              player.hand.cards.forEach((c, index) => {
                if (c === this) {
                  handBlocked.push(index);
                }
              });

              store.prompt(
                state,
                new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY),
                (wantToDiscard) => {
                  if (!wantToDiscard) {
                    return;
                  }

                  // Choose 2 cards from hand to discard
                  store.prompt(
                    state,
                    new ChooseCardsPrompt(
                      player,
                      GameMessage.CHOOSE_CARD_TO_DISCARD,
                      player.hand,
                      {},
                      { min: 2, max: 2, allowCancel: false, blocked: handBlocked },
                    ),
                    (discarded) => {
                      const discardCards = discarded || [];
                      if (discardCards.length < 2) {
                        return;
                      }

                      MOVE_CARDS(store, state, player.hand, player.discard, {
                        cards: discardCards,
                        sourceCard: this,
                      });

                      // Search deck for up to 2 basic energy
                      const energyBlocked: number[] = [];
                      player.deck.cards.forEach((card, index) => {
                        if (!(card instanceof EnergyCard && card.energyType === EnergyType.BASIC)) {
                          energyBlocked.push(index);
                        }
                      });

                      store.prompt(
                        state,
                        new ChooseCardsPrompt(
                          player,
                          GameMessage.CHOOSE_CARD_TO_ATTACH,
                          player.deck,
                          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
                          { min: 0, max: 2, allowCancel: false, blocked: energyBlocked },
                        ),
                        (energySelected) => {
                          const energyCards = energySelected || [];
                          energyCards.forEach((energyCard) => {
                            const attachEffect = new AttachEnergyEffect(
                              player,
                              energyCard as EnergyCard,
                              targetSlot,
                            );
                            store.reduceEffect(state, attachEffect);
                            MOVE_CARDS(store, state, player.deck, targetSlot, {
                              cards: [energyCard],
                              sourceCard: this,
                            });
                          });

                          SHOW_CARDS_TO_PLAYER(store, state, opponent, energyCards);
                          SHUFFLE_DECK(store, state, player);
                        },
                      );
                    },
                  );
                },
              );
            },
          );
        },
      );
    }

    return state;
  }
}
