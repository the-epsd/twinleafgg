import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class BlainesPonyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BLAINES];
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [];

  public attacks = [{
    name: 'Agility',
    cost: [R, C],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Blaine\'s Ponyta.'
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Blaine\'s Ponyta';
  public fullName: string = 'Blaine\'s Ponyta G1';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
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