import { GameError, GameMessage, PokemonCard, PokemonCardList, PowerType, StateUtils } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ClefairyDoll extends PokemonCard {
  public name = 'Clefairy Doll';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '70';
  public set = 'BS';
  public fullName = 'Clefairy Doll BS';
  public stage: Stage = Stage.BASIC;
  public hp = 10;

  public cardType = CardType.NONE;
  public attacks = [];

  public powers = [
    {
      name: 'Clefairy Doll',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      text: 'At any time during your turn before your attack, you may discard Clefairy Doll.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    this.superType = SuperType.TRAINER;

    // Clefairy Doll can't be affected by special conditions
    if (effect instanceof AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
      effect.preventDefault = true;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0] && effect.card === this) {
      this.superType = SuperType.POKEMON;
      const cardList = StateUtils.findCardList(state, this);
      const player = effect.player;
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);

      if (benchIndex !== -1) {
        const cardList = player.bench[benchIndex];
        cardList.moveCardTo(this, player.discard);
      } else {
        player.active.moveCardTo(this, player.discard);
      }

      return state;
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
    }

    return state;
  }
}
