import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class SPikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Birthday Surprise',
    cost: [L, L],
    damage: 30,
    damageCalculation: '+',
    text: 'If it\'s not your birthday, this attack does 30 damage. If it is your birthday, flip a coin. If heads, this attack does 30 damage plus 50 more damage; if tails, this attack does 30 damage.',
  }];

  public set: string = 'PR';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = '_____\'s Pikachu';
  public fullName: string = '_____\'s Pikachu PR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Birthday Surprise — game cannot detect birthdays, so the coin flip is always offered
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 50;
        }
      });
    }

    return state;
  }
}
