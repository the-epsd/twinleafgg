import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
import { KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Munkidoriex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public hp: number = 210;
  public retreat = [C];

  public powers = [{
    name: 'Oh No You Don\'t',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an opponent\'s attack while you have Pecharunt ex in play, your opponent takes one less prize card.'
  }];

  public attacks = [{
    name: 'Dirty Headbutt',
    cost: [D, D, C],
    damage: 190,
    text: 'This Pokémon can\'t use Dirty Headbutt during your next turn.'
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Munkidori ex';
  public fullName: string = 'Munkidori ex SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (player.pecharuntexIsInPlay == true) {
        effect.prizeCount -= 1;
      }
    }

    // Dirty Headbutt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Dirty Headbutt')) {
        player.active.cannotUseAttacksNextTurnPending.push('Dirty Headbutt');
      }
    }

    return state;
  }
}
