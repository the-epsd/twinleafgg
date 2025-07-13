import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class MAlakazamEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX, CardTag.MEGA ];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Alakazam EX';
  public cardType: CardType = P;
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [ C ];

  public powers = [
    {
      name: 'Mega Evolution Rule',
      powerType: PowerType.MEGA_EVOLUTION_RULE,
      text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
    }
  ];

  public attacks = [
    {
      name: 'Zen Force',
      cost: [ P, C ],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each damage counter on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'FCO';
  public name: string = 'M Alakazam-EX';
  public fullName: string = 'M Alakazam-EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // screw the rules
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Alakazam Spirit Link'){
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    // Zen Force
    if (WAS_ATTACK_USED(effect, 0, this)){
      effect.damage += effect.opponent.active.damage * 3;
    }

    return state;
  }

}
