/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Koraidonex extends PokemonCard {

  public tags = [CardTag.ANCIENT, CardTag.POKEMON_ex];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Retribution Strike',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculator: '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Kaiser Tackle',
      cost: [CardType.FIRE, CardType.FIGHTING, CardType.FIGHTING],
      damage: 280,
      text: 'This Pokémon does 60 damage to itself.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Koraidon ex';

  public fullName: string = 'Koraidon ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
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