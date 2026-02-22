import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scyther';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punishing Scissors',
    cost: [M],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.'
  },
  {
    name: 'Cut',
    cost: [M, M],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonWithUsableAbilities = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            pokemonWithUsableAbilities++;
          }
        }
      });

      effect.damage += pokemonWithUsableAbilities * 50;
      return state;
    }
    return state;
  }
}