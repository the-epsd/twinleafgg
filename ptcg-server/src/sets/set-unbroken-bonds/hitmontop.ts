import { GameError, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Hitmontop extends PokemonCard {

  public name = 'Hitmontop';

  public set = 'UNB';

  public fullName = 'Hitmontop UNB';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '101';

  public hp = 90;

  public cardType = CardType.FIGHTING;

  public weakness = [{ type: CardType.PSYCHIC }]

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Finishing Combo',
      cost: [CardType.FIGHTING],
      damage: 0,
      text: 'You can use this attack only if your Hitmonlee used Special Combo during your last turn. This attack does 60 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Spinning Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public specialComboTurn = -10;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (state.turn !== this.specialComboTurn + 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 60);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 60);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack.name === 'Special Combo' && effect.player.active.getPokemonCard()!.name === 'Hitmonlee') {
      this.specialComboTurn = state.turn;
    }
    return state;
  }
}
