import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Xurkitree extends PokemonCard {
  public tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Three Mirrors',
      cost: [L],
      damage: 30,
      damageCalculation: '+' as '+',
      text: 'If your opponent has exactly 3 Prize cards remaining, this attack does 90 more damage.'
    },
    {
      name: 'Signal Beam',
      cost: [L, L],
      damage: 50,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Xurkitree';
  public fullName: string = 'Xurkitree UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Three Mirrors
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() === 3) {
        effect.damage += 90;
      }
    }

    // Attack 2: Signal Beam
    // Ref: AGENTS-patterns.md (Confused status)
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
