import { PokemonCard, CardTag, Stage, CardType, State, StoreLike, StateUtils, PlayerType } from '../../game';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dudunsparceex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Dunsparce';
  public cardType: CardType = C;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tenacious Tail',
    cost: [C],
    damage: 60,
    damageCalculation: 'x',
    text: 'This attack does 60 damage for each of your opponent\'s Pokémon ex in play.'
  },
  {
    name: 'Destructive Drill',
    cost: [C, C, C],
    damage: 150,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Dudunsparce ex';
  public fullName: string = 'Dudunsparce ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentexPokemon = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          opponentexPokemon++;
        }
      });

      effect.damage = opponentexPokemon * 60;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 150);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    return state;
  }
}