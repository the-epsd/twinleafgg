import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GalarianWeezing extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'D';

  public cardType: CardType = CardType.DARK;

  public evolvesFrom = 'Koffing';

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Neutralizing Gas',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Pokémon in play have no Abilities, except for Neutralizing Gas.'
  }];

  public attacks = [{
    name: 'Severe Poison',
    cost: [CardType.DARK],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon during Pokémon Checkup.'
  }];

  public set: string = 'SHF';

  public name: string = 'Galarian Weezing';

  public fullName: string = 'Galarian Weezing SHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 40;
      store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!player.active.cards.includes(this) &&
        !opponent.active.cards.includes(this)) {
        return state;
      }

      if (owner === player) {
        return state;
      }

      // Try reducing ability for opponent
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {

        if (!effect.power.exemptFromAbilityLock) {
          throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
        }
      }
      return state;
    }
    return state;
  }
}
