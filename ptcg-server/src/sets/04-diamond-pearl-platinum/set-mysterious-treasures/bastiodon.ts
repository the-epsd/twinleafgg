import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Bastiodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shieldon';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +40 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Protective Wall',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
  }];

  public attacks = [{
    name: 'Anger Revenge',
    cost: [M, M, C],
    damage: 60,
    text: 'If Bastiodon was damaged by an attack during your opponent\'s last turn, this attack does 40 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Bastiodon';
  public fullName: string = 'Bastiodon MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Protective Wall
    if (effect instanceof PutDamageEffect) {
      const defendingPlayer = StateUtils.findOwner(state, effect.target);
      const attackingPlayer = StateUtils.findOwner(state, effect.source);

      if (attackingPlayer === defendingPlayer) {
        return state;
      }
      if (!defendingPlayer.bench.includes(effect.target)) {
        return state;
      }

      let isInPlay = false;
      defendingPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isInPlay = true;
        }
      });
      if (!isInPlay) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, defendingPlayer, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Anger Revenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if ((this.damageTakenLastTurn ?? 0) > 0) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(40, effect, store, state);
      }
    }

    return state;
  }
}
