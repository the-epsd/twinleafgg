import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Heatmor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hot Lick',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'If the Defending Pokemon is Durant, this attack does 50 more damage.'
    },
    {
      name: 'Firebreathing',
      cost: [R, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Heatmor';
  public fullName: string = 'Heatmor DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hot Lick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defendingPokemon = opponent.active.getPokemonCard();
      if (defendingPokemon && defendingPokemon.name === 'Durant') {
        effect.damage += 50;
      }
    }

    // Firebreathing
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
