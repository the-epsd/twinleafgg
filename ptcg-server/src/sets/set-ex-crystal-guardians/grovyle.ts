import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Treecko';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Agility',
      cost: [P, C, C],
      damage: 30,
      text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Grovyle during your opponent\'s next turn.'
    }
  ];

  public set: string = 'CG';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grovyle';
  public fullName: string = 'Grovyle CG';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.AGILITY_MARKER, this);
          ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
        }
      });
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this) {
      if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
      this.marker.removeMarker(this.AGILITY_MARKER, this);
    }

    return state;
  }
}