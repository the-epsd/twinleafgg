import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class JolteonEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = L;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Swift',
    cost: [L],
    damage: 30,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Flash Ray',
    cost: [L, C, C],
    damage: 70,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  }];

  public set: string = 'GEN';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jolteon-EX';
  public fullName: string = 'Jolteon-EX GEN';

  public readonly FLASH_RAY_MARKER = 'FLASH_RAY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 30);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.marker.addMarker(this.FLASH_RAY_MARKER, this);
      ADD_MARKER(this.FLASH_RAY_MARKER, effect.opponent, this);
    }

    if ((effect instanceof PutDamageEffect) && effect.target.getPokemonCard() === this && effect.source.getPokemonCard()?.stage === Stage.BASIC) {
      if (this.marker.hasMarker(this.FLASH_RAY_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.FLASH_RAY_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.FLASH_RAY_MARKER, effect.player, this);
      this.marker.removeMarker(this.FLASH_RAY_MARKER, this);
    }

    return state;
  }
}