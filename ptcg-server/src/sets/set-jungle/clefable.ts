import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY } from '../../game/store/prefabs/copy-attack-prefabs';

export class Clefable extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardType: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and anything else required in order to use that attack, such as discarding Energy cards. (No matter what type the Defending Pokémon is, Clefable\'s type is still Colorless.)'
    },
    {
      name: 'Minimize',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'All damage done by attacks to Clefable during your opponent\'s next turn is reduced by 20 (after applying Weakness and Resistance).'
    },
  ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable JU';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY(store, state, effect as AttackEffect);
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }
}

