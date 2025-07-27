import { PokemonCard, Stage, CardType, State, StoreLike, GameError, GameMessage } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Virizion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Giga Drain',
    cost: [G],
    damage: 30,
    text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Emerald Blade',
    cost: [G, G, C],
    damage: 130,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Virizion';
  public fullName: string = 'Virizion SV11W';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const healTime = new HealTargetEffect(effect, effect.damage);
      healTime.target = effect.player.active;
      store.reduceEffect(state, healTime);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }
    return state;
  }
}
