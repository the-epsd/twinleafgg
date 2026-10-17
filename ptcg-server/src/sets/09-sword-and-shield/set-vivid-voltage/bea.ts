import { CardType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import {
  TrainerCard,
  CardTarget,
  PlayerType,
  SlotType,
  GameMessage,
  StoreLike,
  State,
  Player,
  pokemonHasCardType,
  EnergyCard,
  AttachEnergyPrompt,
  CardList,
  StateUtils,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Bea extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public name: string = 'Bea';
  public fullName: string = 'Bea VIV';
  public text: string =
    'Discard the top 5 cards of your deck, and attach any Energy cards you discarded in this way to your Benched Fighting Pokémon in any way you like. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [this], sourceCard: this });

      // Discard top 5 cards from deck into a temp list to find energy cards
      const discarded = new CardList();
      const count = Math.min(5, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, discarded, { count, sourceCard: this });

      // Find energy cards among the discarded
      const energyCards = discarded.cards.filter((c) => c instanceof EnergyCard) as EnergyCard[];
      const nonEnergyCards = discarded.cards.filter((c) => !(c instanceof EnergyCard));

      // Discard non-energy cards
      nonEnergyCards.forEach((c) =>
        MOVE_CARDS(store, state, discarded, player.discard, { cards: [c], sourceCard: this }),
      );

      if (energyCards.length === 0) {
        // No energy found, just discard trainer
        MOVE_CARDS(store, state, player.supporter, player.discard, {
          cards: [this],
          sourceCard: this,
        });
        return state;
      }

      // Check if there are Benched Fighting Pokemon to attach to
      const blockedTo: CardTarget[] = [];
      let hasFightingBenched = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        // Only allow benched Pokemon - not the active
        if (player.active === cardList) {
          blockedTo.push(target);
          return;
        }
        if (cardList.cards.length === 0) {
          blockedTo.push(target);
          return;
        }
        const pokemon = cardList.getPokemonCard();
        if (!pokemon || !pokemonHasCardType(pokemon, CardType.FIGHTING)) {
          blockedTo.push(target);
          return;
        }
        hasFightingBenched = true;
      });

      if (!hasFightingBenched) {
        // No valid targets - discard the energy cards too
        energyCards.forEach((c) =>
          MOVE_CARDS(store, state, discarded, player.discard, { cards: [c], sourceCard: this }),
        );
        MOVE_CARDS(store, state, player.supporter, player.discard, {
          cards: [this],
          sourceCard: this,
        });
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          discarded,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 0, max: energyCards.length, blockedTo },
        ),
        (transfers) => {
          transfers = transfers || [];

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card as EnergyCard;
            const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
          }

          // Discard remaining energy cards that weren't attached
          discarded.cards
            .slice()
            .forEach((c) =>
              MOVE_CARDS(store, state, discarded, player.discard, { cards: [c], sourceCard: this }),
            );

          MOVE_CARDS(store, state, player.supporter, player.discard, {
            cards: [this],
            sourceCard: this,
          });
        },
      );
    }

    return state;
  }
}
