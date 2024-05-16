import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class RadiantHisuianSneasler extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.RADIANT];
  
  public cardType: CardType = CardType.DARK;
  
  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Poison Peak',
    powerType: PowerType.ABILITY, 
    text: 'During Pokémon Checkup, put 2 more damage counters on your opponent\'s Poisoned Pokémon.'
  }];

  public attacks = [{
    name: 'Poison Jab',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Radiant Hisuian Sneasler';

  public fullName: string = 'Radiant Hisuian Sneasler LOR';

  public reduceEffect (store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          const opponent = StateUtils.getOpponent(state, player);
          if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
            opponent.active.poisonDamage = 30;
          }
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);

      return state;

    }
    return state;
  }
}


