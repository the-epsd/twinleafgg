import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TapuKokoV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING],
      damage: 40,
      text: ''
    },
    {
      name: 'Spiral Thunder',
      cost: [L, L, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each Energy' +
        'attached to all of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';

  public name: string = 'Tapu Koko V';

  public fullName: string = 'Tapu Koko V BST';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage = 20 + (energyCount * 40);
    }
    return state;
  }

}
