import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Blastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Wartortle';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public additionalCardTypes = [M];
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Shield Veil',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Active Pokémon has no Weakness.'
  }];

  public attacks = [{
    name: 'Enraged Linear Attack',
    cost: [F, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage for each damage counter on Blastoise to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Skull Bash',
    cost: [M, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'CG';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blastoise';
  public fullName: string = 'Blastoise CG';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Shield Veil
    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      let hasBlastoiseInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasBlastoiseInPlay = true;
        }
      });

      if (!hasBlastoiseInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (StateUtils.findOwner(state, effect.target) === player && effect.target === player.active) {
        effect.weakness = [];
      }
    }

    // Enraged Linear Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(effect.player.active.damage, effect, store, state);
    }

    return state;
  }
}