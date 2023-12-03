import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Minior extends PokemonCard {
    
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.FIGHTING;
  
  public hp: number = 70;
  
  public weakness = [{ type: CardType.GRASS }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Far-Flying Meteor',
    powerType: PowerType.ABILITY, 
    text: 'Once during your turn, if this Pokémon is on your Bench, when you attach an Energy card from your hand to this Pokémon, you may switch it with your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Gravitational Tackle',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'This attack does 20 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public set2: string = 'paradoxrift';

  public setNumber: string = '99';

  public name: string = 'Minior';

  public fullName: string = 'Minior PAR';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.active.cards[0] !== this) {
        if (effect instanceof AttachEnergyEffect && effect.target === this as any) {
          const opponent = StateUtils.getOpponent(state, player);
          const target = effect.target;
          opponent.switchPokemon(target);
        }
        return state;
      }


      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        // Get the opponent player
        const opponent = StateUtils.getOpponent(state, player);

        // Get the opponent's active Pokemon card
        const opponentActive = opponent.active.getPokemons()[0];

        // Get the retreat cost for the active Pokemon 
        const retreatCost = opponentActive.retreat;

        // Initialize array to hold required energies
        const requiredEnergies: CardType[] = []; 

        // Loop through each retreat cost and add to array
        retreatCost?.forEach(cost => {
          requiredEnergies.push(cost);
        });

        // Calculate damage based on retreat cost length 
        const damage = requiredEnergies.length * 20;

        // Set the attack damage 
        effect.damage = damage;
      }
      return state;
    }
    return state;
  }
}