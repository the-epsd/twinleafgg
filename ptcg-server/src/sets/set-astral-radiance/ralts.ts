import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Ralts extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Teleportation Burst',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Switch this Pokemon with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Ralts';

  public fullName: string = 'Ralts ASR';

  public usedSpinTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSpinTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSpinTurn === true) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    if (effect instanceof EndTurnEffect && this.usedSpinTurn) {
      this.usedSpinTurn = false;
    }

    return state;
  }
}