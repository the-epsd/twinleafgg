import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Beartic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cubchoo';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Daunt',
      cost: [C, C],
      damage: 40,
      text: 'During your opponent\'s next turn, any damage done by attack from the Defending Pokemon is reduced by 20 (before applying Weakness and Resistance).'
    },
    {
      name: 'Ambush',
      cost: [W, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beartic';
  public fullName: string = 'Beartic NXD';

  public readonly DAUNT_MARKER = 'DAUNT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Daunt - add marker to defending Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.DAUNT_MARKER, opponent.active, this);
    }

    // Reduce damage from marked Pokemon
    if (effect instanceof DealDamageEffect) {
      const source = effect.source;
      if (HAS_MARKER(this.DAUNT_MARKER, source, this)) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }

    // Ambush - flip for extra damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
        }
      });
    }

    // Remove marker at end of turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        REMOVE_MARKER(this.DAUNT_MARKER, cardList, this);
      });
    }

    return state;
  }
}
