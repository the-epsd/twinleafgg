import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game';

export class MrMimeGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = P;
  public hp: number = 150;
  public retreat = [C, C];

  public powers = [{
    name: 'Magic Odds',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by your opponent\'s attacks if that damage is exactly 10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, or 250.'
  }];

  public attacks = [{
    name: 'Breakdown',
    cost: [P, C],
    damage: 0,
    text: 'For each card in your opponent\'s hand, put 1 damage counter on their Active Pokémon.'
  },
  {
    name: 'Life Trick-GX',
    cost: [C],
    damage: 0,
    text: 'Heal all damage from this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Mr. Mime-GX';
  public fullName: string = 'Mr. Mime-GX CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }
      // Prevent all damage if damage is an odd multiple of 10 between 10 and 250 (inclusive)
      if (
        effect.damage % 20 === 0 &&
        effect.damage >= 20 &&
        effect.damage <= 260
      ) {
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(effect.opponent.hand.cards.length, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.usedGX) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      effect.player.usedGX = true;
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, effect.player.active.damage);
    }

    return state;
  }
}