import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, EnergyCard, GameMessage, GamePhase, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Camouflage',
    powerType: PowerType.POKEBODY,
    text: 'If any basic Energy card attached to Kecleon is the same as the Attacking Pokémon\'s type, any damage done by attacks from the Pokémon to Kecleon is reduced by 40 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Blind Scratch',
    cost: [C, C],
    damage: 60,
    text: 'Flip a coin. If tails, this attack does no damage to the Defending Pokémon. Instead, this attack does 20 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Camouflage
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      if (state.phase !== GamePhase.ATTACK || effect.damage <= 0) {
        return state;
      }

      const owner = StateUtils.findOwner(state, effect.target);
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);

      const basicTypes = new Set<CardType>();
      effect.target.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          c.provides.forEach(t => basicTypes.add(t));
        }
      });

      const matches = checkType.cardTypes.some(t => basicTypes.has(t));
      if (matches) {
        effect.damage = Math.max(0, effect.damage - 40);
      }
    }

    // Blind Scratch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          return;
        }

        effect.damage = 0;
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const target = selected[0];
          target.damage += 20;
          const afterDamage = new AfterDamageEffect(effect, 20);
          afterDamage.target = target;
          store.reduceEffect(state, afterDamage);
        });
      });
    }

    return state;
  }
}
