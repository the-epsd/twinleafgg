import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';

import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Palossandex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sandygast';
  public cardType: CardType = P;
  public hp: number = 280;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Sand Tomb',
    cost: [C, C, C],
    damage: 160,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Barite Jail',
    cost: [W, P, F],
    damage: 0,
    text: 'Put damage counters on each of your opponent\'s Benched Pokémon until its remaining HP is 100.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '91';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Palossand ex';
  public fullName: string = 'Palossand ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Tomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    // Barite Jail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {

        if (cardList === opponent.active) {
          return state;
        }

        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);

        let resultingDamage = (checkHpEffect.hp - cardList.damage) - 100;
        if (resultingDamage <= 0) { resultingDamage = 0; }

        const damageEffect = new PutCountersEffect(effect, resultingDamage);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}