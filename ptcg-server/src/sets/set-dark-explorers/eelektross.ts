import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

export class Eelektross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Eelektrik';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Suction Heal',
      cost: [L, C, C],
      damage: 40,
      text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
    },
    {
      name: 'Slurp Shakedown',
      cost: [L, L, C, C],
      damage: 0,
      text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. This attack does 60 damage to the new Defending Pokémon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eelektross';
  public fullName: string = 'Eelektross DEX';

  private usedSlurpShakedown: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Suction Heal - heal same amount as damage dealt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healEffect = new HealTargetEffect(effect, effect.damage);
      healEffect.target = effect.player.active;
      store.reduceEffect(state, healEffect);
    }

    // Slurp Shakedown - switch opponent's active with bench, then deal 60 to new active
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSlurpShakedown = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSlurpShakedown) {
      this.usedSlurpShakedown = false;

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);

        const damageEffect = new DealDamageEffect(effect as unknown as AttackEffect, 60);
        damageEffect.target = opponent.active;
        store.reduceEffect(state, damageEffect);
      });
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect) {
      this.usedSlurpShakedown = false;
    }

    return state;
  }
}
