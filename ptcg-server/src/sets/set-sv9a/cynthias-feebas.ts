import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class CynthiasFeebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Undulate',
      cost: [C],
      damage: 10,
      text: 'If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Feebas';
  public fullName: string = 'Cynthia\'s Feebas SV9a';

  public readonly UNDULATE_MARKER = 'UNDULATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result){
          this.marker.addMarker(this.UNDULATE_MARKER, this);
          ADD_MARKER(this.UNDULATE_MARKER, effect.opponent, this);
        }
      });
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this){
      if (this.marker.hasMarker(this.UNDULATE_MARKER, this)){
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.UNDULATE_MARKER, effect.player, this)){
      REMOVE_MARKER(this.UNDULATE_MARKER, effect.player, this);
      this.marker.removeMarker(this.UNDULATE_MARKER, this);
    }

    return state;
  }
}