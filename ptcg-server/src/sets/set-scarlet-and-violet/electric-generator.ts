import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, EnergyCard, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils, ShuffleDeckPrompt, ShowCardsPrompt, GameError, CardTarget } from '../../game';

export class ElectricGenerator extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '170';

  public name: string = 'Electric Generator';

  public fullName: string = 'Electric Generator SVI';

  public text: string =
    'Look at the top 5 cards of your deck and attach up to 2 Lightning Energy cards you find there to your Benched Lightning Pokémon in any way you like. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const temp = new CardList();

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let lightningPokemonOnBench = false;

      player.bench.forEach(benchSpot => {
        const card = benchSpot.getPokemonCard();
        if (card && card.cardType === CardType.LIGHTNING) {
          lightningPokemonOnBench = true;
        }
      });

      if (!lightningPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== CardType.LIGHTNING) {
          blocked2.push(target);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 5);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Lightning Energy';
      });

      // If no energy cards were drawn, move all cards to deck
      if (energyCardsDrawn.length === 0) {
        return store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        ), () => {
          temp.cards.forEach(card => {
            player.deck.cards.unshift(card);
          });
          player.supporter.moveCardTo(this, player.discard);

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
        });
      }

      // Attach energy if drawn
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        temp,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, min: 0, max: 2, blockedTo: blocked2 }
      ), transfers => {
        if (transfers) {
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            temp.moveCardTo(transfer.card, target);
          }
        }

        temp.cards.forEach(card => {
          player.deck.cards.unshift(card);
        });
        player.supporter.moveCardTo(this, player.discard);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      });
    }
    return state;
  }
}