import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 40;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Invisible Wall',
    powerType: PowerType.POKEPOWER,
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
      if (effect.damage >= 30) {
        if (effect.target.specialConditions.length > 0) {
          return state;
        }
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