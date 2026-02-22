

import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DialgaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 180;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Overclock',
      cost: [M],
      damage: 0,
      text: 'Draw cards until you have 6 cards in your hand.'
    },
    {
      name: 'Shred',
      cost: [M, C, C],
      damage: 80,
      shredAttack: true,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Timeless-GX',
      cost: [M, M, M, C, C],
      damage: 150,
      gxAttack: true,
      text: 'Take another turn after this one. (Skip the between-turns step.) (You can\'t use more than 1 GX attack in a game.) '
    }
  ];

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public name: string = 'Dialga-GX';

  public fullName: string = 'Dialga-GX UPR';

  public readonly TIMELESS_GX_MARKER = 'TIMELESS_GX_MARKER';

  public readonly TIMELESS_GX_MARKER_2 = 'TIMELESS_GX_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TIMELESS_GX_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.TIMELESS_GX_MARKER, this);
      effect.player.marker.removeMarker(this.TIMELESS_GX_MARKER_2, this);
      effect.player.usedTurnSkip = false;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TIMELESS_GX_MARKER, this)) {
      effect.player.marker.addMarker(this.TIMELESS_GX_MARKER_2, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      while (player.hand.cards.length < 6) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 80);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      player.marker.addMarker(this.TIMELESS_GX_MARKER, this);
      effect.player.usedTurnSkip = true;
    }

    return state;
  }
}
