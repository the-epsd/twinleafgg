import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, AttachEnergyPrompt, CardList, EnergyCard, GameMessage, PlayerType, SlotType, ShuffleDeckPrompt, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

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
    text: 'Once during your turn, you may look at the top 4 cards of your deck and attach any number of Basic Metal Energy you find there to your Pokémon in any way you like. Shuffle the other cards and put them at the bottom of your deck.'
  }];

  public attacks = [{
    name: 'Beam',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';

  public set: string = 'SV5';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Metang';

  public fullName: string = 'Metang SV5';

  public readonly METAL_MAKER_MARKER = 'METAL_MAKER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
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
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Basic Metal Energy';
      });
  
      // If no energy cards were drawn, move all cards to deck & shuffle
      if (energyCardsDrawn.length == 0) {
        temp.cards.slice(0, 4).forEach(card => {

          store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.hand.applyOrder(order);

            temp.moveCardTo(card, deckBottom); 
          });
        });
      } else {
        
        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS, 
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Metal Energy'},
          {min: 0, max: energyCardsDrawn.length}
        ), transfers => {
      
          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.hand.applyOrder(order);
        
                temp.moveCardTo(card, deckBottom); 
              });
            });
            return state;
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}