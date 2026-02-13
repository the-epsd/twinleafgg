import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [W],
      damage: 20,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra PLF';

  public readonly SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';
  public readonly SMOKESCREEN_USED_MARKER = 'SMOKESCREEN_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.SMOKESCREEN_MARKER, opponent.active, this);
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.SMOKESCREEN_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.SMOKESCREEN_USED_MARKER, opponent, this)) {
        return state;
      }

      effect.preventDefault = true;
      ADD_MARKER(this.SMOKESCREEN_USED_MARKER, opponent, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const useAttackEffect = new UseAttackEffect(player, effect.attack);
          store.reduceEffect(state, useAttackEffect);
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SMOKESCREEN_USED_MARKER, this);

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.SMOKESCREEN_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.SMOKESCREEN_MARKER, this);
    }

    return state;
  }
}
