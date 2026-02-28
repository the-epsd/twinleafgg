import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
export class Infernape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Monferno';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Flaming Fighter',
    powerType: PowerType.ABILITY,
    text: 'Put 6 damage counters instead of 2 on your opponent\'s Burned Pokémon between turns.'
  }];

  public attacks = [
    {
      name: 'Burst Punch',
      cost: [R, C],
      damage: 50,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Infernape';
  public fullName: string = 'Infernape UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Flaming Fighter (passive - increase burn damage between turns)
    // Ref: set-journey-together/magmortar.ts (Magma Surge - BetweenTurnsEffect burn modifier)
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let infernapeOwner: any = null;
      [player, opponent].forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            infernapeOwner = p;
          }
        });
      });

      if (!infernapeOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, infernapeOwner, this)) {
        return state;
      }

      const infernapeOpponent = StateUtils.getOpponent(state, infernapeOwner);
      if (effect.player === infernapeOpponent && infernapeOpponent.active.specialConditions.includes(SpecialCondition.BURNED)) {
        // Normal burn does 2 damage counters (20 damage), we want 6 (60 damage)
        // So add 40 more (4 more damage counters)
        effect.burnDamage += 40;
      }
    }

    // Attack 1: Burst Punch
    // Ref: AGENTS-patterns.md (Burned)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
