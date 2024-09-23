import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { DealDamageEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class SlitherWing extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.ANCIENT];

  public stage = Stage.BASIC;

  public cardType = CardType.FIGHTING;

  public hp = 140;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stomp Off',
      cost: [CardType.FIGHTING],
      damage: 0,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Burning Turbulence',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 120,
      text: 'This Pokémon also does 90 damage to itself. Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name: string = 'Slither Wing';

  public fullName: string = 'Slither Wing PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard 2 cards from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 1);

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 90);
      dealDamage.target = player.active;
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
      return store.reduceEffect(state, dealDamage);


    }
    return state;
  }
}