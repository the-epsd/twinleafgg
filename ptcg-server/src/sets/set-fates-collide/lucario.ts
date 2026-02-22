import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lucario extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Riolu';

  public cardType: CardType = CardType.METAL;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Vacuum Wave',
      cost: [CardType.METAL],
      damage: 50,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    }, {
      name: 'Fight Alone',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: 30,
      text: 'If you have fewer Pokemon in play than your opponent, this ' +
        'attack does 60 more damage for each Pokemon fewer you have in play.'
    },
  ];

  public set: string = 'FCO';

  public name: string = 'Lucario';

  public fullName: string = 'Lucario FCO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let playerPokemons = 0;
      let opponentPokemons = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { playerPokemons += 1; });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => { opponentPokemons += 1; });

      const fewerPokemons = Math.max(0, opponentPokemons - playerPokemons);
      effect.damage += fewerPokemons * 60;
    }

    return state;
  }

}
