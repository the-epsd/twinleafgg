import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, PlayerType, StateUtils, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';

export class Toxicroak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Croagunk';
  public cardType: CardType = CardType.DARK;
  public hp: number = 110;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'More Poison',
    powerType: PowerType.ABILITY,
    text: 'Put 2 more damage counters on your opponent\'s Poisoned Pokemon during Pokemon Checkup.'
  }];

  public attacks = [{
    name: 'Poison Claws',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 70,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Poisoned.'
  }];

  public set: string = 'SSH';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Toxicroak';
  public fullName: string = 'Toxicroak SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {

          try {
            const stub = new PowerEffect(player, {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: ''
            }, this);
            store.reduceEffect(state, stub);
          } catch {
            return state;
          }

          const opponent = StateUtils.getOpponent(state, player);
          if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
            opponent.active.poisonDamage = 30;
          }
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }
}