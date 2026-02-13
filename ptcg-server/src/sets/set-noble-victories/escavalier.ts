import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Escavalier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Karrablast';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Slash',
      cost: [M, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Guard Press',
      cost: [M, C, C],
      damage: 60,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Escavalier';
  public fullName: string = 'Escavalier NVI';

  public readonly GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Guard Press - add marker for damage reduction
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          ADD_MARKER(this.GUARD_PRESS_MARKER, cardList, this);
        }
      });
    }

    // Reduce damage if marker is present
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (HAS_MARKER(this.GUARD_PRESS_MARKER, effect.target, this)) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.GUARD_PRESS_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
