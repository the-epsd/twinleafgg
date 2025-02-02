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

  // private POISON_MODIFIER_MARKER = 'POISON_MODIFIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let toxicroakOwner = null;
      [player, opponent].forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            toxicroakOwner = p;
          }
        });
      });

      if (!toxicroakOwner) {
        return state;
      }

      try {
        const stub = new PowerEffect(toxicroakOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const toxicroakOpponent = StateUtils.getOpponent(state, toxicroakOwner);
      if (effect.player === toxicroakOpponent && toxicroakOpponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.poisonDamage += 20;
        console.log('toxicroak:', effect.poisonDamage);
      }
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