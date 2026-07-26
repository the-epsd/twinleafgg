import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class EthansPinsir extends PokemonCard {
  public tags = [CardTag.ETHANS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Vice Grip',
    cost: [G],
    damage: 20,
    text: ''
  },
  {
    name: 'One-Point Return',
    cost: [C, C, C],
    damage: 70,
    damageCalculation: '+',
    text: 'If any of your Ethan\'s Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 100 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Ethan\'s Pinsir';
  public fullName: string = 'Ethan\'s Pinsir DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // One-Point Return
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, {
        byAttackDamage: true,
        tags: [CardTag.ETHANS],
      })) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
