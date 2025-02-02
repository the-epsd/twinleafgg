import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// CES Dhelmise 22 (https://limitlesstcg.com/cards/CES/22)
export class Dhelmise extends PokemonCard {

  public tags = [ ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { name: 'Giga Drain', cost: [CardType.GRASS, CardType.COLORLESS], damage: 30, text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.' },
    { name: 'Powerful Spin', cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS], damage: 130, text: 'This Pokémon can\'t attack during your next turn.' }
  ];

  public set: string = 'CES';
  
  public setNumber: string = '22';
  
  public cardImage = 'assets/cardback.png';

  public name: string = 'Dhelmise';

  public fullName: string = 'Dhelmise CES';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giga Drain
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
  
      const healTargetEffect = new HealTargetEffect(effect, effect.damage);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }
    
    // Powerful Spin
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    return state;
  }
}