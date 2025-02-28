import { CardType, PlayerType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = F;
  public hp: number = 190;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Powerful Rage',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Earthquake',
      cost: [F, F, C],
      damage: 180,
      text: 'This attack also does 30 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '139';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      //The attack needs to be reset; otherwise, it will always cause 20 damage.
      effect.damage = 0;
      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 2 * effect.player.active.damage);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      //I couldn't find a prefab to add damage to my Pokémon on the bench.
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList !== player.active) {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }
    return state;
  }
}