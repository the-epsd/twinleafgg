import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { CoinFlipPrompt, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Thick Skinned',
    powerType: PowerType.POKEMON_POWER,
    text: 'Snorlax can\'t become Asleep, Confused, Paralyzed, or Poisoned. This power can\'t be used if Snorlax is already Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Body Slam',
    cost: [C, C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      const player = state.players[state.activePlayer];
      const cardList = StateUtils.findCardList(state, this);

      // Try reducing ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.POKEMON_POWER,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (cardList instanceof PokemonCardList && cardList.getPokemonCard() === this) {
        cardList.specialConditions = cardList.specialConditions.filter(condition =>
          condition !== SpecialCondition.ASLEEP &&
          condition !== SpecialCondition.CONFUSED &&
          condition !== SpecialCondition.PARALYZED
        );
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    return state;
  }
}