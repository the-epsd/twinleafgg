import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils,
  GamePhase
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Weedle';
  public tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Stiffen',
    cost: [G],
    damage: 0,
    text: 'During your opponent\'s next turn, this Pokémon takes 40 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'CRE';
  public name: string = 'Kakuna';
  public fullName: string = 'Kakuna CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public regulationMark: string = 'E';

  public readonly STIFFEN_MARKER = 'STIFFEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.STIFFEN_MARKER, effect.player, this);
    }

    if (effect instanceof PutDamageEffect && HAS_MARKER(this.STIFFEN_MARKER, StateUtils.getOpponent(state, effect.player), this) && effect.target.getPokemonCard() === this) {

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 40;
    }

    if (effect instanceof EndTurnEffect && effect.player !== StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
      REMOVE_MARKER(this.STIFFEN_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }

}
