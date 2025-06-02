import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Garchomp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gabite';
  public cardType: CardType = N;
  public hp: number = 150;
  public weakness = [{ type: Y }];
  public retreat = [];

  public attacks = [
    {
      name: 'Quick Dive',
      cost: [C, C],
      damage: 0,
      text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Royal Blades',
      cost: [F, C, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If you played Cynthia from your hand during this turn, this attack does 100 more damage.'
    }
  ];

  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Garchomp';
  public fullName: string = 'Garchomp UPR';

  private readonly CYNTHIA_MARKER = 'CYNTHIA_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(50, effect, store, state);
    }

    // Track if we played Cynthia this turn
    if (effect instanceof TrainerEffect && effect.trainerCard.name == 'Cynthia') {
      // Put a "played Cynthia this turn" marker on ourselves.
      const player = effect.player;

      ADD_MARKER(this.CYNTHIA_MARKER, player, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CYNTHIA_MARKER, this)) {
      // Remove marker at the end of turn.
      effect.player.marker.removeMarker(this.CYNTHIA_MARKER);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (HAS_MARKER(this.CYNTHIA_MARKER, effect.player, this)) {
        effect.damage += 100;
      }
    }

    return state;
  }
}