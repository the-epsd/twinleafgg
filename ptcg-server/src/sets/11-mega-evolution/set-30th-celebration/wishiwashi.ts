import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GamePhase, StateUtils } from "../../../game";
import { AfterDamageEffect } from "../../../game/store/effects/attack-effects";
import { Effect } from "../../../game/store/effects/effect";
import { EffectOfAbilityEffect } from "../../../game/store/effects/game-effects";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../../game/store/prefabs/prefabs";

export class Wishiwashi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Counterattack Grouping',
    powerType: PowerType.ABILITY,
    text: 'If your Wishiwashi or Wishiwashi ex is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if your Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [W],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Wishiwashi';
  public fullName: string = 'Wishiwashi 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattack Grouping
    if (effect instanceof AfterDamageEffect && state.phase === GamePhase.ATTACK) {
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (effect.player === owner || effect.target !== owner.active) {
        return state;
      }

      const activeCard = owner.active.getPokemonCard();
      if (!activeCard || (activeCard.name !== 'Wishiwashi' && activeCard.name !== 'Wishiwashi ex')) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const damageEffect = new EffectOfAbilityEffect(owner, this.powers[0], this, effect.source);
      store.reduceEffect(state, damageEffect);
      if (damageEffect.target) {
        damageEffect.target.damage += 30;
      }
    }

    // Surprise Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
