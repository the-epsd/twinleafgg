/* eslint-disable indent */
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Meditite extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public retreat = [CardType.COLORLESS];

  public weakness = [{ type: CardType.PSYCHIC }];

  public attacks = [
    {
      name: 'Calm Mind',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Chop',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Meditite';

  public fullName: string = 'Meditite SV7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healEffect = new HealEffect(player, effect.player.active, 20);
      state = store.reduceEffect(state, healEffect);
    }
    return state;
  }
}