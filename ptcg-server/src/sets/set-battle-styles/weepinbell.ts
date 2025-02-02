import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class Weepinbell extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'E';

  public evolvesFrom = 'Bellsprout';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Dangerous Mucus',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve ' +
      '1 of your Pokémon, you may make your ' +
      'opponent\'s Active Pokémon Burned and Poisoned.'
  }];

  public attacks = [
    {
      name: 'Vine Whip',
      cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Weepinbell';

  public fullName: string = 'Weepinbell BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);
  
      // Apply burn and poison to opponent's active Pokemon
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.specialConditions.push(SpecialCondition.BURNED);
      opponent.active.specialConditions.push(SpecialCondition.POISONED);
  
      return state;
    }
  
    return state;
  }
}