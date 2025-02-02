import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class DeoxysV extends PokemonCard {

  public stage = Stage.BASIC;

  public cardType = CardType.PSYCHIC;

  public hp = 210;

  public tags = [CardTag.POKEMON_V];

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psychic',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 30,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
    },
    {
      name: 'Power Edge',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 140,
      text: ''
    },
  ];

  public regulationMark = 'F';

  public set = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '266';

  public name = 'Deoxys V';

  public fullName = 'Deoxys V SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 20;
    }
    return state;
  }
}