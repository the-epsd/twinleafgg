import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../../game';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Garganaclex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Naclstack';
  public cardType: CardType = F;
  public hp: number = 340;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Salty Body',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by any Special Conditions.'
  }];

  public attacks = [{
    name: 'Block Hammer',
    cost: [F, C, C],
    damage: 170,
    text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Garganacl ex';
  public fullName: string = 'Garganacl ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Block Hammer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 60;
    }

    // Salty Body
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const activeCard = player.active.getPokemonCard();

        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        if (player.active.specialConditions.length === 0
          || (activeCard && activeCard.name !== 'Garganacl ex')
          || (activeCard && activeCard.powers[0] !== this.powers[0])) {
          return state;
        }

        const conditions = player.active.specialConditions.slice();
        conditions.forEach(condition => {
          player.active.removeSpecialCondition(condition);
        });
      });
      return state;
    }

    return state;
  }
}
