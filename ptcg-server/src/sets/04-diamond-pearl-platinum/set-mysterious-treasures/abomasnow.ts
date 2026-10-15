import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../../game/store/effects/check-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Abomasnow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snover';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Glacier Snow',
    powerType: PowerType.POKEBODY,
    text: 'If Abomasnow is your Active Pokémon and is damaged by an opponent\'s attack (even if Abomasnow is Knocked Out), the Attacking Pokémon is now Asleep.'
  }];

  public attacks = [{
    name: 'Heavy Blizzard',
    cost: [W, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, put 1 damage counter on each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Abomasnow';
  public fullName: string = 'Abomasnow MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Glacier Snow
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);

      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      store.reduceEffect(
        state,
        new AddSpecialConditionsPowerEffect(
          abilityOwner,
          this,
          effect.source,
          [SpecialCondition.ASLEEP],
        ),
      );
    }

    // Heavy Blizzard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            if (cardList !== opponent.active) {
              const countersEffect = new PutCountersEffect(effect, 10);
              countersEffect.target = cardList;
              store.reduceEffect(state, countersEffect);
            }
          });
        }
      });
    }

    return state;
  }
}
