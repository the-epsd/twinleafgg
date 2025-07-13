import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON} from '../../game/store/prefabs/attack-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class MAudinoEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX, CardTag.MEGA ];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Audino EX';
  public cardType: CardType = C;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public retreat = [ C, C, C ];

  public powers = [
    {
      name: 'Mega Evolution Rule',
      powerType: PowerType.MEGA_EVOLUTION_RULE,
      text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
    }
  ];

  public attacks = [
    {
      name: 'Magical Symphony',
      cost: [ C, C, C ],
      damage: 110,
      text: 'If you played a Supporter card from your hand during this turn, this attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'FCO';
  public name: string = 'M Audino-EX';
  public fullName: string = 'M Audino-EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // screw the rules
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Audino Spirit Link'){
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    // Magical Symphony
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      if (player.supporterTurn >= 1) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state);
      }
    }

    return state;
  }

}
