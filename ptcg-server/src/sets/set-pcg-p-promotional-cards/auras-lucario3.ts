import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class AurasLucario3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Detect',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Quick Attack',
    cost: [M, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'PCGP';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 93';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Detect
    // Ref: set-burning-shadows/ledyba.ts (Agility)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Quick Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
