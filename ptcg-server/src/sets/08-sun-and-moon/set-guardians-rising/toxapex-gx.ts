import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import {
  BLOCK_IF_GX_ATTACK_USED,
  MULTIPLE_COIN_FLIPS_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class ToxapexGx extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mareanie';
  public cardType: CardType = P;
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Spike Cannon',
    cost: [P],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 30 damage for each heads.'
  },
  {
    name: 'Super Intense Poison',
    cost: [P, P, P],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 10 damage counters instead of 1 on that Pokémon between turns.'
  },
  {
    name: 'Total Shelter-GX',
    cost: [P, P, P],
    damage: 150,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'GRI';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toxapex-GX';
  public fullName: string = 'Toxapex-GX GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spike Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    // Super Intense Poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      effect.opponent.active.poisonDamage = 100;
    }

    // Total Shelter-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      BLOCK_IF_GX_ATTACK_USED(effect.player);
      effect.player.usedGX = true;
      PREVENT_DAMAGE(store, state, effect, this);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
    }

    return state;
  }
}
