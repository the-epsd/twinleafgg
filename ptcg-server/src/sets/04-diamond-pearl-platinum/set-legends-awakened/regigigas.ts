import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Regigigas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Slow Start',
    powerType: PowerType.POKEBODY,
    text: 'Regigigas can\'t attack until your opponent has 3 or less Prize cards left.'
  }];

  public attacks = [{
    name: 'Crush Grip',
    cost: [W, F, M, C],
    damage: 120,
    text: 'If the Defending Pokémon already has any damage counters on it, this attack\'s base damage is 40 instead of 120.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Regigigas';
  public fullName: string = 'Regigigas LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slow Start
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (opponent.getPrizeLeft() > 3) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Crush Grip
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.damage > 0) {
        effect.damage = 40;
      }
    }

    return state;
  }
}
