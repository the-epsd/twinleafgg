import { State, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { TERA_RULE, WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Koraidonex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = F;
  public hp: number = 230;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Orichalcum Fang',
    cost: [F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 120 more damage.'
  },
  {
    name: 'Impact Blow',
    cost: [F, F, C],
    damage: 200,
    text: 'During your next turn, this Pokémon can\'t use Impact Blow.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Koraidon ex';
  public fullName: string = 'Koraidon ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Orichalcum Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(effect.player, { byAttackDamage: true })) {
        effect.damage += 120;
      }
      return state;
    }

    // Impact Blow
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Impact Blow');
    }

    TERA_RULE(effect, state, this);

    return state;
  }
}
