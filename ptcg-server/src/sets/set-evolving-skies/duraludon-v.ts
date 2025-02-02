import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddMarkerEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class DuraludonV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V, CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 220;

  public weakness = [];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];


  
  public attacks = [
    {
      name: 'Metal Claw',
      cost: [ CardType.FIGHTING, CardType.METAL ],
      damage: 70,
      text: ''
    },
    {
      name: 'Breaking Swipe',
      cost: [ CardType.FIGHTING, CardType.METAL, CardType.METAL ],
      damage: 140,
      text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 30 less damage (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '122';

  public name: string = 'Duraludon V';

  public fullName: string = 'Duraludon V EVS';

  public readonly BREAKING_SWIPE_MARKER = 'BREAKING_SWIPE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.BREAKING_SWIPE_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }
  
    // Reduce damage by 30
    if (effect instanceof PutDamageEffect
        && effect.source.marker.hasMarker(this.BREAKING_SWIPE_MARKER, this)) {
  
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      effect.damage -= 30;
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.BREAKING_SWIPE_MARKER, this);
    }
  
    return state;
  }
  
}
  