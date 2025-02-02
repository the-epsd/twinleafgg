import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class TapuKokoVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX ];

  public regulationMark = 'E';
  
  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Tapu Koko V';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 320;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Max Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 180,
      text: 'If you have more Prize cards remaining than your ' +
      'opponent, their Active Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '51';

  public name: string = 'Tapu Koko VMAX';

  public fullName: string = 'Tapu Koko VMAX BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.getPrizeLeft() >= opponent.getPrizeLeft()) {
        const specialConditionEffect = new AddSpecialConditionsEffect(
          effect, [SpecialCondition.PARALYZED]
        );
        store.reduceEffect(state, specialConditionEffect);
      }
    }
    return state;
  }

}
