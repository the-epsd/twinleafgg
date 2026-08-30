import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { RetreatEffect, EffectOfAbilityEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vibrava';
  public cardType: CardType[] = [F];
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Labyrinth of Sand',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon can\'t retreat.'
  }];

  public attacks = [{
    name: 'Desert Geyser',
    cost: [F, C, C],
    damage: 130,
    text: 'If your opponent has a Stadium in play, discard it. If you discarded a Stadium in this way, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public setNumber: string = '91';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Labyrinth of Sand
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      const canApplyAbility = new EffectOfAbilityEffect(opponent, this.powers[0], this, player.active);
      store.reduceEffect(state, canApplyAbility);
      if (!canApplyAbility.target) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Desert Geyser
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard !== undefined) {
        DISCARD_A_STADIUM_CARD_IN_PLAY(state);
        PREVENT_DAMAGE(store, state, effect, this);
        PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
      }
    }

    return state;
  }
}
