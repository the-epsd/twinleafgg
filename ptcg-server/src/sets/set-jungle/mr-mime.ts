import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 40;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Invisible Wall',
    powerType: PowerType.POKEMON_POWER,
    text: 'Whenever an attack (including your own) does 30 or more damage to Mr. Mime (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.) This power can\'t be used if Mr. Mime is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Meditate',
    cost: [P, C],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Mr. Mime';

  public fullName: string = 'Mr Mime JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
        cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
        cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
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

      if (effect.damage >= 30) {
        effect.damage = 0;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damage = opponent.active.damage;
      effect.damage += damage;
    }

    return state;
  }

}