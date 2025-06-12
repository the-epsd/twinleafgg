import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class MGardevoirEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX, CardTag.MEGA ];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Gardevoir EX';
  public cardType: CardType = Y;
  public hp: number = 210;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [ C, C ];

  public powers = [
    {
      name: 'Mega Evolution Rule',
      powerType: PowerType.MEGA_EVOLUTION_RULE,
      text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
    }
  ];

  public attacks = [
    {
      name: 'Brilliant Arrow',
      cost: [ Y, C, C ],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage times the amount of [Y] Energy attached to all of your Pokémon.'
    }
  ];

  public set: string = 'PRC';
  public name: string = 'M Gardevoir-EX';
  public fullName: string = 'M Gardevoir-EX PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // screw the rules
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target.tool && effect.target.tool.name === 'Gardevoir Spirit Link'){
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    // Brilliant Arrow
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      let fairyEnergies = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const goodEnergy = card.cards.filter(card =>
          card instanceof EnergyCard && card.name === 'Fairy Energy'
        );

        fairyEnergies += goodEnergy.length;
      });

      effect.damage = fairyEnergies * 30;
    }

    return state;
  }

}
