import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, AttachEnergyPrompt, CardList, EnergyCard, GameMessage, PlayerType, SlotType, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Magnezone extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Magneton';

  public cardType: CardType = CardType.METAL;  

  public hp: number = 150;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public abilities = [{
    name: 'Giga Magnet',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY, 
    text: 'Once during your turn, you may look at the top 6 cards of your deck and attach any number of [M] Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
  }];

  public attacks = [{
    name: 'Power Beam',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name: string = 'Magnezone';

  public fullName: string = 'Magnezone ASR';

  public readonly GIGA_MAGNET_MARKER = 'GIGA_MAGNET_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      
      const player = effect.player;
      const temp = new CardList();
  
      player.deck.moveTo(temp, 6);
  
      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Metal Energy';
      });
  
      // If no energy cards were drawn, move all cards to deck & shuffle
      if (energyCardsDrawn.length == 0) {
        temp.cards.slice(0, 6).forEach(card => {
          temp.moveCardTo(card, player.deck); 

          store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
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
          {superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy'},
          {min: 0, max: energyCardsDrawn.length}
        ), transfers => {
      
          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.deck); 

              store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
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