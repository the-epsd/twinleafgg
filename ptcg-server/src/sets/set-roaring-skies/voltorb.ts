import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [CardType.LIGHTNING],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  },
  {
    name: 'Big Explosion',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 60,
    text: 'This Pokémon does 60 damage to itself. '
  }];

  public set: string = 'ROS';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 60);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}