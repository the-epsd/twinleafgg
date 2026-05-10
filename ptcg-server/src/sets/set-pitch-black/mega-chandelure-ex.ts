import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import {
  IS_ABILITY_BLOCKED,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class MegaChandelureex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lampent';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 350;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Cursed Flame',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.',
  }];

  public attacks = [{
    name: 'Phantom Maze',
    cost: [P, P],
    damage: 130,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.',
  }];

  public set: string = 'M5';
  public setNumber: string = '36';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Chandelure ex';
  public fullName: string = 'Mega Chandelure ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Cursed Flame — Ref: set-roaring-skies/hydreigon-ex.ts (CheckRetreatCostEffect); inverted for opponent Active cost increase
    if (effect instanceof CheckRetreatCostEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwnerSide = StateUtils.getOpponent(state, retreatingPlayer);

      let chandelureInPlay = false;
      abilityOwnerSide.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          chandelureInPlay = true;
        }
      });

      if (!chandelureInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwnerSide, this)) {
        return state;
      }

      effect.cost.push(CardType.COLORLESS);
      return state;
    }

    // Phantom Maze — Ref: set-brilliant-stars/flygon.ts (Desert Pillar — Colorless in opponent Active Retreat Cost)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkRetreat = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreat);
      const colorlessCount = checkRetreat.cost.filter(c => c === CardType.COLORLESS).length;

      effect.damage = 130 + 50 * colorlessCount;
    }

    return state;
  }
}
