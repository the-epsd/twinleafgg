import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, AttachEnergyPrompt, CardList, EnergyCard, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class KyuremVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public tags = [CardTag.POKEMON_VMAX];

  public evolvesFrom = 'Kyurem V';

  public cardType: CardType = CardType.WATER; 
   
  public hp = 330;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public abilities = [{
    name: 'Glaciated World',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard the top card of your deck. If that card is a [W] Energy card, attach it to 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Max Frost',
    cost: [CardType.WATER, CardType.WATER, CardType.WATER],
    damage: 120,
    text: 'You may discard any amount of [W] Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public name: string = 'Kyurem V';

  public fullName: string = 'Kyurem V LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const temp = new CardList();
  
  
      player.deck.moveTo(temp, 1);
  
      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Basic Water Energy';
      });
  
      // If no energy cards were drawn, move all cards to hand
      if (energyCardsDrawn.length == 0) {
        temp.cards.slice(0, 1).forEach(card => {
          temp.moveCardTo(card, player.hand); 
        });
      } else {
        
  
        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS, 
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {superType: SuperType.ENERGY, energyType: EnergyType.BASIC},
          {min: 0, max: energyCardsDrawn.length}
        ), transfers => {
      
          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.hand); // Move card to hand
              
            });
          }
        });
      }
    
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

        const player = effect.player;
      
        return store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active, // Card source is target Pokemon
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Water Energy' },
          { allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
      
            let totalDiscarded = 0; 
      
            cards.forEach(target => {
      
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.cards = [target];

      
              totalDiscarded += discardEnergy.cards.length;
            
              effect.damage = (totalDiscarded * 60) + 120;
      
              store.reduceEffect(state, discardEnergy);

            });
          }
        });
      }
      return state;
    }
    return state;
  }
}