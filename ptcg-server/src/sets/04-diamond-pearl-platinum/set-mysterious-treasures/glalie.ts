import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Glalie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Craggy Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Glalie is your Active Pokémon, any damage done by attacks from your opponent\'s Stage 2 Evolved Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Intimidation Pebble',
    cost: [W, W, C],
    damage: 50,
    text: 'Flip a coin. If heads, your opponent can\'t play any Trainer cards or Supporter cards from his or her hand during your opponent\'s next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Glalie';
  public fullName: string = 'Glalie MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Craggy Face
    if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const abilityOwner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (abilityOwner.active.getPokemonCard() !== this) {
        return state;
      }

      if (effect.player === abilityOwner) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const attacker = effect.source.getPokemonCard();
      if (!attacker || attacker.stage !== Stage.STAGE_2) {
        return state;
      }

      // PutDamage on Active is the post-W/R step of DealDamage — only reduce once before W/R.
      if (effect instanceof PutDamageEffect) {
        const targetOwner = StateUtils.findOwner(state, effect.target);
        if (effect.target === targetOwner.active) {
          return state;
        }
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    // Intimidation Pebble
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, supporter: true });
        }
      });
    }

    return state;
  }
}
