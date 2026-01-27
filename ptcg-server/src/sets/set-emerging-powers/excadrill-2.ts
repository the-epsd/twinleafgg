import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Excadrill2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drilbur';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dig',
      cost: [F, C],
      damage: 30,
      text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Earthquake',
      cost: [F, C, C],
      damage: 70,
      text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Excadrill';
  public fullName: string = 'Excadrill EPO 57';

  public readonly DIG_MARKER = 'DIG_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.marker.addMarker(this.DIG_MARKER, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.bench.forEach(bench => {
        if (bench.cards.length > 0) {
          const putDamage = new PutDamageEffect(effect, 10);
          putDamage.target = bench;
          store.reduceEffect(state, putDamage);
        }
      });
    }

    // Prevent damage and effects
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.DIG_MARKER, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const attacker = effect.player;
      if (player !== attacker) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DIG_MARKER, this);
    }

    return state;
  }
}
