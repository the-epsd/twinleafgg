import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hippowdon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Hippopotas';
  public cardType: CardType = F;
  public hp: number = 160;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Ram',
    cost: [F, F],
    damage: 60,
    text: ''
  },
  {
    name: 'Super Sandstorm',
    cost: [F, F, C],
    damage: 150,
    text: 'This attack also does 40 damage to each Benched Pokémon that has any damage counters on it (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'H';
  public set: string = 'DRI';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hippowdon';
  public fullName: string = 'Hippowdon DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Super Sandstorm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      [player, opponent].forEach(p => {
        const playerType = p === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;
        p.forEachPokemon(playerType, (cardList) => {
          if (cardList === p.active || cardList.cards.length === 0 || cardList.damage === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    return state;
  }
}
