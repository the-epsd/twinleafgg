import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Venonat extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Stun Spore',
        cost: [ CardType.GRASS ],
        damage: 10,
        text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
      },
      {
        name: 'Leech Life',
        cost: [ CardType.GRASS, CardType.COLORLESS ],
        damage: 10,
        text: 'Remove a number of damage counters from Venonat equal to the damage done to the Defending Pokémon (after applying Weakness and Resistance).'
      }
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Venonat';

  public fullName: string = 'Venonat JU';


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

      const healEffect = new HealEffect(player, player.active, effect.damage);
      state = store.reduceEffect(state, healEffect);
    }
    return state;
  }
}