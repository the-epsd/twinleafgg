import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { PokemonCard, StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaDarkraiex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 280;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Night Raid',
    cost: [D, D],
    damage: 110,
    damageCalculation: '+',
    text: 'If any of your Benched Pokémon have any damage counters on them, this attack does 110 more damage.',
  },
  {
    name: 'Abyss Eye',
    cost: [D, D, D],
    damage: 0,
    text: 'If your opponent\'s Active Pokémon is affected by any Special Condition, it is now Knocked Out.',
  }];

  public set: string = 'M5';
  public setNumber: string = '46';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Darkrai ex';
  public fullName: string = 'Mega Darkrai ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Night Raid
    // Ref: set-mega-evolution/mega-camerupt-ex.ts (Roasting Heat - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const benchDamaged = player.bench.some(b => b.cards.length > 0 && b.damage > 0);
      if (benchDamaged) {
        effect.damage += 110;
      }
    }

    // Abyss Eye
    // Ref: set-paradox-rift/roaring-moon-ex.ts (KnockOutOpponentEffect — blockable attack KO)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentActive = opponent.active;

      if (opponentActive.specialConditions.length > 0) {
        opponentActive.clearAllSpecialConditions();
        KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
      }
    }

    return state;
  }
}
