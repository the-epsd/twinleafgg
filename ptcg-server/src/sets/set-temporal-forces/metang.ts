import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, AttachEnergyPrompt, CardList, EnergyCard, GameMessage, PlayerType, SlotType, ShuffleDeckPrompt, GameError, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Metang extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Beldum';

  public cardType: CardType = CardType.METAL;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Metal Maker',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may look at the top 4 cards of your deck and attach any number of Metal Energy you find there to your Pokémon in any way you like. Shuffle the other cards and put them at the bottom of your deck.'
  }];

  public attacks = [{
    name: 'Beam',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public name: string = 'Metang';

  public fullName: string = 'Metang TEF';

  public readonly METAL_MAKER_MARKER = 'METAL_MAKER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const temp = new CardList();
      // Create deckBottom and move hand into it
      const deckBottom = new CardList();

      if (player.marker.hasMarker(this.METAL_MAKER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.deck.moveTo(temp, 4);
      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Metal Energy';
      });

      // If no energy cards were drawn, move all cards to deck & shuffle
      if (energyCardsDrawn.length == 0) {

        store.prompt(state, [new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        )], () => {
          temp.cards.forEach(card => {
            store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              temp.applyOrder(order);
              temp.moveCardTo(card, deckBottom);
              deckBottom.applyOrder(order);
              deckBottom.moveTo(player.deck);
              player.marker.addMarker(this.METAL_MAKER_MARKER, this);

              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                  cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                }
              });

            });
            return state;
          });
          return state;
        });
      }

      if (energyCardsDrawn.length >= 1) {

        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
          { min: 0, max: energyCardsDrawn.length }
        ), transfers => {

          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                temp.applyOrder(order);
                temp.moveCardTo(card, deckBottom);
                deckBottom.applyOrder(order);
                deckBottom.moveTo(player.deck);
                player.marker.addMarker(this.METAL_MAKER_MARKER, this);

                player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                  if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                  }
                });

              });
              return state;
            });
          }
        });
      }
      return state;
    }
    return state;
  }
}
