import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Seismitoad extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Seismic Punch',
      cost: [C, C],
      damage: 30,
      text: 'Does 30 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Splashing Turn',
      cost: [W, W, C, C],
      damage: 80,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad PLF';

  public usedSplashingTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.cards.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList === opponent.active) {
          return;
        }
        if (cardList.cards.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSplashingTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSplashingTurn) {
      this.usedSplashingTurn = false;
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    if (effect instanceof EndTurnEffect && this.usedSplashingTurn) {
      this.usedSplashingTurn = false;
    }

    return state;
  }
}
