import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class AggronVMAX extends PokemonCard {

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_VMAX];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Aggron V';

  public cardType: CardType = CardType.METAL;

  public hp: number = 330;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Cracking Stomp',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Max Take Down',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 270,
      text: 'This Pokémon also does 30 damage to itself.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Aggron VMAX';

  public fullName: string = 'Aggron VMAX BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Discard 1 card from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 1);

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}