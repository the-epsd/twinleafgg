import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS, NEXT_TURN_ATTACK_BONUS } from '../../game/store/prefabs/prefabs';

export class Virizion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Double Draw',
      cost: [G],
      damage: 0,
      text: 'Draw 2 cards.'
    },
    {
      name: 'Leaf Wallop',
      cost: [G, G, C],
      damage: 40,
      damageCalculation: '+',
      text: 'During your next turn, this Pokémon\'s Leaf Wallop attack does 40 more damage (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Virizion';
  public fullName: string = 'Virizion NVI';

  public readonly LEAF_WALLOP_MARKER = 'LEAF_WALLOP_MARKER';
  public readonly LEAF_WALLOP_CLEAR_MARKER = 'LEAF_WALLOP_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 2);
    }

    // Leaf Wallop
    // Refs: set-boundaries-crossed/watchog.ts (Psych Up), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 40,
      bonusMarker: this.LEAF_WALLOP_MARKER,
      clearMarker: this.LEAF_WALLOP_CLEAR_MARKER
    });

    return state;
  }
}
