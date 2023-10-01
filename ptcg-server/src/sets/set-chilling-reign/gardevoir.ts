import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, GameMessage, AttachEnergyPrompt, EnergyCard, SlotType, StateUtils, CardList } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Gardevoir extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 140;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Shining Arcana',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may look at the top 2 cards ' +
    'of your deck and attach any number of basic Energy ' +
    'cards you find there to your Pokémon in any way you' +
    'like. Put the other cards into your hand.'
  }];

  public attacks = [
    {
      name: 'Brainwave',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 60,
      text: 'This attack does 30 more damage for each [P] Energy ' +
      'attached to this Pokémon.'
    }
  ];

  public set: string = 'CRE';

  public regulationMark = 'E';

  public name: string = 'Gardevoir';

  public fullName: string = 'Gardevoir CRE';

  public readonly FLEET_FOOTED_MARKER = 'FLEET_FOOTED_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FLEET_FOOTED_MARKER, this);
    }
    

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      
      const player = effect.player;
      const temp = new CardList();


      player.deck.moveTo(temp, 2);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC;
      });

      // If no energy cards were drawn, move all cards to hand
      if (energyCardsDrawn.length == 0) {
        temp.cards.slice(0, 2).forEach(card => {
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
  
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
  
        let energyCount = 0;
        checkProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.PSYCHIC;
          }).length;
        });
        effect.damage += energyCount * 30;
      }

      if (effect instanceof EndTurnEffect) {

        effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
          if (player instanceof Gardevoir) {
            player.marker.removeMarker(this.FLEET_FOOTED_MARKER);
          }
          return state;
        });
        return state;
      }
      return state;
    }
    return state;
  }
}