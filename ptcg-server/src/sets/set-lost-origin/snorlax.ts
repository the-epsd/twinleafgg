import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect, AddSpecialConditionsEffect, RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { CoinFlipPrompt, GameMessage } from '../../game';


export class Snorlax extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public regulationMark = 'F';

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Unfazed Fat',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
  }];

  public attacks = [{
    name: 'Thumping Snore',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 180 ,
    text: 'This Pokémon is now Asleep. During Pokémon Checkup, flip 2 coins instead of 1. If either of them is tails, this Pokémon is still Asleep.'
  }];

  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '143';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      const player = effect.player;
      specialConditionEffect.target = effect.player.active;
      store.reduceEffect(state, specialConditionEffect);

      let coin1Result = false;
      let coin2Result = false;
      store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
        coin1Result = result;
      });
      store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
        coin2Result = result;
      });
      if (coin1Result && coin2Result) {

        // Create effect to remove Asleep
        const removeAsleep = new RemoveSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
        removeAsleep.target = player.active;
  
        // Reduce effect to remove Asleep
        state = store.reduceEffect(state, removeAsleep);
        return state;
      }
    }

    // Prevent damage effects
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }


}
