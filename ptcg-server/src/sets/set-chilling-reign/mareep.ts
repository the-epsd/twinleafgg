import { PokemonCard, Stage, CardType, GamePhase, State, StoreLike } from '../../game';
import { AddMarkerEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Mareep extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.LIGHTNING;
  
  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Growl',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 20 less damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Static Shock',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Mareep';

  public fullName: string = 'Mareep CRE 47';

  public readonly GROWL_MARKER = 'GROWL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.GROWL_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }
  
    // Reduce damage by 30
    if (effect instanceof PutDamageEffect
        && effect.source.marker.hasMarker(this.GROWL_MARKER, this)) {
  
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      effect.damage -= 20;
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.GROWL_MARKER, this);
    }
  
    return state;
  }
  
}
  