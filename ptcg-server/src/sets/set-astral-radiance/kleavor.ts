import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kleavor extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Scyther';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rout',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Rocky Tackle',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'This Pokémon also does 50 damage to itself.'
    }
  ];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public name: string = 'Kleavor';

  public fullName: string = 'Kleavor ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = opponentBenched;

      effect.damage = 10 + (totalBenched * 30);

    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}