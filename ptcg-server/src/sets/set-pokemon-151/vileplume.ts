import { PokemonCard, Stage, CardType, PowerType, AttachEnergyPrompt, CardList, EnergyCard, EnergyType, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Vileplume extends PokemonCard {

  public stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardType = CardType.GRASS;

  public hp = 140;
  
  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fully Blooming Energy',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 8 cards of your deck and attach any number of Basic Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '45';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {

    
      const player = effect.player;
  
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      
      const temp = new CardList();


      player.deck.moveTo(temp, 8);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC;
      });

      // If no energy cards were drawn, move all cards to hand
      if (energyCardsDrawn.length == 0) {
        temp.cards.slice(0, 8).forEach(card => {
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
          return state;
        });
      }
      return state;
    }
    return state;
  }
}